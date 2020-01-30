"use strict";

const bcrypt = require("bcrypt");
const Joi = require("@hapi/joi");
const jwt = require("jsonwebtoken");
//const mysqlPool = require("../../../database/mysql-pool");

const checkExistenceAccount = require("../account/check-account-existence");

async function validate(payload) {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
  });

  Joi.assert(payload, schema);
}

async function login(req, res, next) {
  const accountData = { ...req.body };
  try {
    await validate(accountData);
  } catch (e) {
    return res.status(400).send(e);
  }

  try {
    const data = await checkExistenceAccount(accountData.email);
    if (data.length !== 1) {
      return res
        .status(401)
        .send("Usuario no autorizado: el email no está registrado");
    }

    const user = data[0];

    try {
      const isPasswordOk = await bcrypt.compare(
        accountData.password,
        user.password
      );
      if (!isPasswordOk) {
        return res.status(401).send("Password incorrecta");
      }
    } catch (e) {
      res.status(500).send("error al comprobar la contraseña");
    }

    const payloadJwt = {
      userId: user.user_id,
      role: user.role
    };

    const jwtExpiresIn = parseInt(process.env.AUTH_ACCESS_TOKEN_TTL);
    const token = jwt.sign(payloadJwt, process.env.AUTH_JWT_SECRET, {
      expiresIn: jwtExpiresIn
    });

    return res.send({
      accessToken: token,
      avatarUrl: user.avatar_url,
      expiresIn: jwtExpiresIn
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send("error durante el login");
  }
}

module.exports = login;
