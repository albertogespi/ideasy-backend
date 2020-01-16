"use strict";

//LIBRARIES
const joi = require("@hapi/joi");
const bcript = require("bcrypt");
const uuid = require("uuid/v4");
const sg = require("@sendgrid/mail");

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

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
    const connection;
    try{
        connection = await mysqlPool.getConnection();

        await connection.query("INSERT INTO users SET ?", {
            id: userId,
            email: accountData.email,
            password: securePassword,
            created_at: createdAt
        });

        connection.release();

        res.status(201).send(); //everything ok

        //send an email
        await sendWelcomeEmail(accountData.email);
    } catch(e){
        if(connection){
            connection.release();
        }

        if(e.code = "ER_DUP_KEY"){
            return res.status(409).send();
        }

        return res.status(500).send();
    }
}

function validateSchema(data){
    const schema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
    });

    joi.assert(data, schema); //data != schema --> error
}

function sendWelcomeEmail(email){
    const username = email.split("@")[0];

    const message = {
        to: email,
        from: "portaldeideas@yopmail.com",
        subject: "Bienvenido :)",
        text: `Querido/a ${username}, ¡te damos la bienvenida a PortalDeIdeas! Gracias por registrarte!`,
    }
    
    await sg.send(msg);
}

module.exports = createAccount;
