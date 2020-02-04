"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

async function validateSchema(payload) {
  const schema = Joi.object({
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    newPassword: Joi.string()
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
  const accountData = { ...req.body, userId };

  try {
    await validateSchema(accountData);
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

    try {
      const sqlCheckPassword = `SELECT password FROM users WHERE user_id = ?`;
      const [rows] = await connection.execute(sqlCheckPassword, [userId]);
      connection.release();

      if (rows.length !== 1) {
        return res.status(401).send();
      }

      const userData = rows[0];

      try {
        const isPasswordOk = await bcrypt.compare(
          accountData.password,
          userData.password
        );
        if (!isPasswordOk) {
          return res
            .status(401)
            .send(
              "password incorrecta: introduzca su password actual para poder cambiarla"
            );
        }
      } catch (e) {
        return res.status(500).send();
      }
    } catch (e) {
      return res.status(500).send();
    }

    const securePassword = await bcrypt.hash(accountData.newPassword, 10);

    const sqlUpdatePassword = `UPDATE users
    SET password = ?, 
    updated_at = ?
    WHERE user_id = ?
    AND deleted_at IS NULL`;

    await connection.query(sqlUpdatePassword, [securePassword, now, userId]);
    connection.release();
    return res.status(200).send("Password cambiada");
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
