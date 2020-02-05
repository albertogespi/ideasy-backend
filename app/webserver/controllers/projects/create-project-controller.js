"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/v4");

async function validateSchema(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(45)
      .required(),
    description: Joi.string()
      .trim()
      .min(10)
      .max(255)
      .required(),
    details: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required(),
    category: Joi.string()
      .trim()
      .required(),
    complexity: Joi.number()
      .integer()
      .min(1)
      .max(3)
      .required()
  });

  Joi.assert(payload, schema);
}

async function createProject(req, res, next) {
  const { userId } = req.claims;
  const projectData = { ...req.body };

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

    const projectId = uuidV4();

    const sqlCreateProject = `INSERT INTO projects
    SET project_id = ?,
    user_id = ?,
    title = ?,
    description = ?,
    details = ?,
    category = ?,
    complexity = ?,
    created_at = ?`;

    await connection.query(sqlCreateProject, [
      projectId,
      userId,
      projectData.title,
      projectData.description,
      projectData.details,
      projectData.category,
      projectData.complexity,
      now
    ]);

    connection.release();
    return res.status(201).send("proyecto creado");
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

module.exports = createProject;
