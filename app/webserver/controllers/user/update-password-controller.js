"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");

async function validateSchema(payload) {
  const schema = Joi.object({
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function updatePassword(req, res, next) {
  const { userId } = req.claims;
  const data = { ...req.body, userId };

  try {
    await validateSchema(data);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const sqlUpdatePassword = `UPDATE users
    SET password = ?, 
    updated_at = ?
    WHERE user_id = ?`;

    await connection.query(sqlUpdatePassword, [data.password, now, userId]);
    connection.release();
    return res.status(201).send("Password cambiada");
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

module.exports = updatePassword;
