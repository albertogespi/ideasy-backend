"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getDocuments(req, res, next) {
  const { projectId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();
    const sqlQuery = `SELECT * FROM documents WHERE project_id = ?`;
    const [documents] = await connection.execute(sqlQuery, [projectId]);
    connection.release();

    if (documents.length !== 1) {
      return res.status(404).send("no se ha encontrado el proyecto");
    }

    return res.status(200).send(documents);
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getDocuments;
