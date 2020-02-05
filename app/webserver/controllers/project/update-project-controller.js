"use strict";

const mysqlPool = require("../../../database/mysql-pool");

const Joi = require("@hapi/joi");

async function validateSchema(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(45),
    description: Joi.string()
      .trim()
      .min(10)
      .max(255),
    details: Joi.string()
      .trim()
      .min(10)
      .max(65536),
    projectId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function updateProject(req, res, next) {
  const { projectId } = req.params;
  const { userId } = req.claims;
  const { title, description, details, category, complexity } = req.body;
  const projectData = { title, description, details, projectId };

  try {
    await validateSchema(projectData);
  } catch (e) {
    return res.status(400).send(e);
  }

  let connection;

  try {
    connection = await mysqlPool.getConnection();
    const now = new Date()
      .toISOString()
      .substring(0, 19)
      .replace("T", " ");

    const sqlQuery = `UPDATE projects SET 
      title = ?,
      description = ?,
      details = ?,
      category = ?,
      complexity = ?,
      updated_at = ?
      WHERE project_id = ?
      AND user_id = ?`;

    await connection.query(sqlQuery, [
      title,
      description,
      details,
      category,
      complexity,
      now,
      projectId,
      userId
    ]);

    connection.release();

    res.status(201).send();
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

module.exports = updateProject;
