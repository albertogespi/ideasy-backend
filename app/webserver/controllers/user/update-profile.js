"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");

async function validateSchema(payload) {
  const schema = Joi.object({
    contactEmail: Joi.string().email(),
    contactWeb: Joi.string().allow(null),
    name: Joi.string().max(25),
    surname: Joi.string()
      .max(45)
      .allow(null),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .allow(null),
    newPassword: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .allow(null),
    userId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function updateProfile(req, res, next) {
  const { userId } = req.claims;
  const accountData = { ...req.body, userId };

  console.log(req.body);

  if (accountData.surname === "") {
    accountData.surname = null;
  }

  if (accountData.contactWeb === "") {
    accountData.contactWeb = null;
  }

  if (accountData.newPassword === "") {
    accountData.newPassword = null;
  }

  try {
    await validateSchema(accountData);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  console.log(`hola hola`);

  let connection;
  try {
    connection = await mysqlPool.getConnection();
    const now = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    try {
      const sqlGetUser = `SELECT * FROM users WHERE user_id = ?`;
      const [rows] = await connection.execute(sqlGetUser, [userId]);
      connection.release();

      if (rows.length !== 1) {
        return res.status(404).send();
      }

      const userData = rows[0];

      if (accountData.password) {
        try {
          const isPasswordOk = await bcrypt.compare(
            accountData.password,
            userData.password
          );
          if (!isPasswordOk) {
            return res
              .status(400)
              .send(
                "password incorrecta: introduzca su password actual para modificar sus datos"
              );
          }
        } catch (e) {
          return res.status(500).send();
        }
      }
    } catch (e) {
      return res.status(500).send();
    }

    let securePassword;
    if (accountData.newPassword) {
      securePassword = await bcrypt.hash(accountData.newPassword, 10);
    } else {
      securePassword = await bcrypt.hash(accountData.password, 10);
    }

    const sqlUpdatePassword = `UPDATE users
    SET name = '${accountData.name}',
    surname = '${accountData.surname || "NULL"}',
    password = '${securePassword}',
    contact_email = '${accountData.contactEmail}',
    contact_web = '${accountData.contactWeb || "NULL"}', 
    updated_at = '${now}'
    WHERE user_id = '${userId}'
    AND deleted_at IS NULL`;

    await connection.query(sqlUpdatePassword);

    connection.release();
    return res.status(200).send("Perfil actualizado");
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

module.exports = updateProfile;
