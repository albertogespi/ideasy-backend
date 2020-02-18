"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getContributedProjects(req, res, next) {
  const { userId } = req.params;
  const filters = req.query;

  let connection;
  try {
    connection = await mysqlPool.getConnection();

    //query to obtain the data
    let sqlQuery = `SELECT projects.* FROM projects INNER JOIN documents ON projects.project_id = documents.project_id WHERE documents.user_id = "${userId}"`;

    if (Object.keys(filters).length !== 0) {
      for (const filter in filters) {
        sqlQuery += ` AND ${filter} = "${filters[filter]}"`;
      }
    }

    const [data] = await connection.execute(sqlQuery);
    connection.release();
    console.log(data);

    return res.status(200).send(data);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getContributedProjects;
