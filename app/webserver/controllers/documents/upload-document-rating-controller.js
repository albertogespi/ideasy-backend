"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");

async function validateSchema(payload) {
  const schema = Joi.object({
    rating: Joi.number()
      .integer()
      .min(1)
      .max(5)
      .required(),
    docId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function uploadRating(req, res, next) {
  const { rating } = req.body;
  const { docId } = req.params;
  const data = { rating, docId };

  try {
    await validateSchema(data);
  } catch (e) {
    console.error(e);
    return res.status(400).send(e);
  }

  let connection;
  try {
    connection = await mysqlPool.getConnection();

    const sqlQuery = `UPDATE documents SET rating = ? 
    WHERE doc_id = ?`;

    await connection.query(sqlQuery, [rating, docId]);

    connection.release();
    return res.status(201).send("rating enviado");
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

module.exports = uploadRating;
