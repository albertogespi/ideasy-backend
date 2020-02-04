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
    projectId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
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
  const { projectId, docId } = req.params;
  const data = { rating, projectId, docId };

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
    WHERE project_id = ? AND doc_id = ?`;

    await connection.query(sqlQuery, [rating, projectId, docId]);

    connection.release();
    return res.status(200).send("rating enviado");
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
