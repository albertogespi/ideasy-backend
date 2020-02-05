"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getProject(req, res, next) {
  const { projectId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();

    const sqlQuery = `SELECT * FROM projectsAndFollowers WHERE project_id = "${projectId}"`;
    const [rows] = await connection.execute(sqlQuery);
    connection.release();

    if (rows.length !== 1) {
      return res.status(404).send("el proyecto no existe");
    }

    const [project] = rows;

    return res.status(200).send(project);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getProject;
