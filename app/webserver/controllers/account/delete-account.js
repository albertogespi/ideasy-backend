"use strict";

const bcrypt = require("bcrypt");
const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");

async function validate(payload) {
  const schema = Joi.object({
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  });

  Joi.assert(payload, schema);
}

async function deleteAccount(req, res, next) {
  const { password } = req.body;
  const { userId } = req.claims;
  const accountData = { userId, password };

  try {
    await validate(accountData);
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

    try {
      const sqlCheckPassword = `SELECT password FROM users WHERE user_id = ?`;
      const [rows] = await connection.execute(sqlCheckPassword, [userId]);
      connection.release();

      if (rows.length !== 1) {
        return res.status(404).send();
      }

      const userData = rows[0];

      try {
        const isPasswordOk = await bcrypt.compare(
          accountData.password,
          userData.password
        );
        if (!isPasswordOk) {
          return res
            .status(400)
            .send(
              "password incorrecta: introduzca su password para borrar su cuenta"
            );
        }
      } catch (e) {
        return res.status(500).send();
      }
    } catch (e) {
      return res.status(500).send();
    }

    const sqlDeleteAccount = `UPDATE users
    SET deleted_at = ?
    WHERE user_id = ?
    AND deleted_at IS NULL`;

    await connection.query(sqlDeleteAccount, [now, userId]);
    connection.release();
    return res.status(200).send("Cuenta borrada");
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

module.exports = deleteAccount;
