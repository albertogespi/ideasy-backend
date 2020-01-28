"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");

async function validateSchema(payload) {
  const schema = Joi.object({
    name: Joi.string()
      .max(25)
      .required(),
    surname: Joi.string()
      .max(45)
      .allow(null)
      .optional(),
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function updateName(req, res, next) {
  const { userId } = req.claims;
  const userData = { ...req.body, userId };

  try {
    await validateSchema(userData);
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

    const sqlUpdateName = `UPDATE users
    SET name = ?, 
    surname = ?, 
    updated_at = ?
    WHERE user_id = ?`;

    await connection.query(sqlUpdateName, [
      userData.name,
      userData.surname,
      now,
      userId
    ]);
    connection.release();
    return res.status(200).send("nombre cambiado");
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

module.exports = updateName;
