"use strict";

//LIBRARIES
const joi = require("@hapi/joi");
const bcript = require("bcrypt");
const uuid = require("uuid/v4");
const sg = require("@sendgrid/mail");

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

sg.setApiKey(process.env.SENDGRID_API_KEY);

async function createAccount(req, res, next) {
	const accountData = { ...req.body };

	//check data
	try {
		await validateSchema(accountData);
	} catch (e) {
		return res.status(400).send(e);
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
		try {
			await sendWelcomeEmail(accountData.email, accountData.name);
		} catch (e) {
			throw e;
		}
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
		role: joi.string().required(),
	});

	joi.assert(data, schema); //data != schema --> error
}

async function sendWelcomeEmail(email, name) {
	const username = `${name}`;

	const message = {
		to: email,
		from: "portaldeideas@yopmail.com",
		subject: "Bienvenido :)",
		text: `Querido/a ${username}, ¡te damos la bienvenida a PortalDeIdeas! Gracias por registrarte!`,
	};

	await sg.send(message);
}

module.exports = createAccount;
