"use strict";

const mysqlPool = require("../../../database/mysql-pool");
const Joi = require("@hapi/joi");
const uuidV4 = require("uuid/V4");

async function validate(payload) {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .min(1)
      .max(255)
      .required(),
    description: Joi.string()
      .trim()
      .min(10)
      .max(280)
      .required(),
    details: Joi.string()
      .trim()
      .min(10)
      .max(65536)
      .required()
  });

  Joi.assert(payload, schema);
}

async function createProject(req, res, next) {
  const { userId } = req.claims;
  const projectData = { ...req.body };

  try {
    await validate(projectData);
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
    const project = {
      id: projectId,
      title,
      description,
      details,
      user_id: userId,
      created_at: now
    };

    const sqlCreateProject = `UPDATE projects
    SET project_id = ?,
    title = ?,
    description = ?,
    details = ?,
    sector = ?,
    complexity = ?,
    created_at = ?
    WHERE user_id = ?`;

    await connection.query(sqlCreateProject, project);

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
