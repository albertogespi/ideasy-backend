"use strict";

//CONSTANTS
const ORG_CODE = "org";
const DEV_CODE = "dev";

//LIBRARIES
const joi = require("@hapi/joi");
const bcript = require("bcrypt");
const uuid = require("uuid/v4");
const sg = require("@sendgrid/mail");

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

//OTHER FUNCTIONS
const checkExistenceAccount = require("../account/check-account-existence");

sg.setApiKey(process.env.SENDGRID_API_KEY);

async function createAccount(req, res, next) {
	const accountData = { ...req.body };

	//check data
	try {
		await validateSchema(accountData);
	} catch (e) {
		return res.status(400).send(e);
	}

	//check email existance in ddbb
	try {
		const data = await checkExistenceAccount(accountData.email);

		if (data.length !== 0) {
			return res
				.status(401)
				.send("Email no disponible: usuario ya existente con dicho email.");
		}
	} catch (e) {
		console.error(e);
		return res.status(500).send(); //server connection failed
	}

	//date of creation
	const now = new Date();
	const createdAt = now
		.toISOString()
		.replace("T", " ")
		.substring(0, 19);

	//generate user id
	const userId = uuid();

	//encrypt pw
	const securePassword = await bcript.hash(accountData.password, 10);

	//save in ddbb
	let connection;
	try {
		connection = await mysqlPool.getConnection();

		await connection.query("INSERT INTO users SET ?", {
			user_id: userId,
			email: accountData.email,
			password: securePassword,
			name: accountData.name,
			surname: accountData.surname,
			role: accountData.role,
			created_at: createdAt,
		});

		connection.release();

		res.status(201).send(); //everything ok

		//send an email
		await sendWelcomeEmail(accountData);
	} catch (e) {
		if (connection) {
			connection.release();
		}

		if ((e.code = "ER_DUP_KEY")) {
			console.log(e);
			return res.status(409).send();
		}

		return res.status(500).send();
	}
}

function validateSchema(data) {
	const schema = joi.object({
		email: joi
			.string()
			.email()
			.required(),
		name: joi.string().required(),
		surname: joi.string(),
		password: joi
			.string()
			.regex(/^[a-zA-Z0-9]{3,30}$/)
			.required(),
		role: joi
			.string()
			.length(3)
			.required(),
	});

	joi.assert(data, schema); //data != schema --> error
}

async function sendWelcomeEmail(accountData) {
	let username = `${accountData.name}`;
	let title, intro, description, benefits;

	if (accountData.role === ORG_CODE) {
		title = "Bienvenida a PortalDeIdeas";
		intro = `${username}, muchas gracias por confiar en nosotros.`;
		description = "Estos son los servicios que ofrece nuestra página web:";
		benefits = `<li style="padding - bottom: 10px">Generad y publicad vuestros propios proyectos/ideas a desarrollar.</li>
		<li>Control absoluto sobre toda la actividad de los mismos: acceso, alcance...</li>
		<li>Gestión de las submisiones y comunicación directa con el desarrollador a través de los medios de comunicación integrados que facilitamos en la web.</li>`;
	} else if (accountData.role === DEV_CODE) {
		if (accountData.surname !== undefined) {
			username += ` ${accountData.surname}`;
		}
		title = "¡Bienvenido/a a PortalDeIdeas!";
		intro = `Querido/a ${username}, te damos la bienvenida a PortalDeIdeas. ¡Gracias por registrarte!`;
		description =
			"Disfruta ahora de todas las ventajas y servicios que ofrece nuestra página web.";
		benefits = `<li style="padding-bottom:10px">Participa en proyectos y ¡sube tus propias soluciones!</li>
		            <li>Contacta directamente con la organización por los medios de comunicación que ofrecemos.</li>`;
	}

	const message = {
		to: accountData.email,
		from: "portaldeideas@yopmail.com",
		subject: "Bienvenido :)",
		html: `<html lang="es">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta http-equiv="X-UA-Compatible" content="ie=edge" />
		<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700|Patrick+Hand&display=swap" rel="stylesheet">
	</head>
	<body style="background-color: #f4f6f6; height: 100%; margin: 10px; font-family: 'Montserrat', sans-serif; font-size: 16px;">
		<header style="padding:10px; border: 3px solid rgb(51, 51, 51, 0.8); border-radius: 5px" >
			<h1 style="text-align:center; color: #117a65">${title}</h1>
		</header>
		<main>
		    <section id="intro">
		        <p style="text-align:center; color: #333333">${intro}</p>
		    </section>
		    
		    <section id="benefits">
		        <h2 style="font-family: 'Patrick Hand', cursive; font-weight:400; color: #333333; text-align:center">${description}</h2>
		        <p style="text-align:center; color:#117a65; font-size: 90px; margin:0">⬇</p>
		        <ul style="color: #333333; list-style: disc inside none; border: 2px solid rgb(0, 0, 0, 0.1); padding: 15px 15px 15px 30px; border-radius: 20px; margin: 20px">${benefits}</ul>
		    </section>
		</main>
		<footer style="background-color: #333333; color: #f4f6f6; text-align:center; padding: 15px">
		    <p style="text-align:center">·· Accede a la página: <a href="https://google.es/" style="color: #117a65">portaldeideas.es</a> ··</p>
		</footer>
	</body>
</html>`,
	};

	try {
		await sg.send(message);
	} catch (e) {
		console.log(e);
	}
}

module.exports = createAccount;
