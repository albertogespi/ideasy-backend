"use strict";

const mysqlPool = require("../../../database/mysql-pool");

const Joi = require("@hapi/joi");

async function validateSchema(payload) {
  const schema = Joi.object({
    projectId: Joi.string()
      .guid({
        version: ["uuidv4"]
      })
      .required()
  });

  Joi.assert(payload, schema);
}

async function closeProject(req, res, next) {
  const { projectId } = req.params;
  const projectData = { projectId };

  try {
    await validateSchema(projectData);
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

    const sqlQuery = `UPDATE projects
    SET closed_at = ?
    WHERE project_id = ?`;

    await connection.query(sqlQuery, [now, projectId]);

    connection.release();
    return res.status(200).send("proyecto cerrado");
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

module.exports = closeProject;
