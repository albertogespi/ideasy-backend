"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");

async function validateSchema(payload) {
  const schema = Joi.object({
    contactEmail: Joi.string()
      .email()
      .required(),
    contactWeb: Joi.string().allow(null),
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function updateContact(req, res, next) {
  const { userId } = req.claims;
  const userData = { ...req.body, userId };

  try {
    await validateSchema(userData);
  } catch (e) {
    return res.status(400).send();
  }

  let connection;

  try {
    connection = await mysqlPool.getConnection();
    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const sqlUpdateContact = `UPDATE users
    SET contact_email = ?, 
    contact_web = ?, 
    updated_at = ?
    WHERE user_id = ?`;

    await connection.query(sqlUpdateContact, [
      userData.contactEmail,
      userData.contactWeb,
      now,
      userId
    ]);

    connection.release();
    return res.status(200).send("datos de contacto modificados");
  } catch (e) {
    if (connection) {
      connection.release();
    }
    console.error(e);
    return res.status(500).send({
      message: e.message
    });
  }
}

module.exports = updateContact;
