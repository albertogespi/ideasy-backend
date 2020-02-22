"use strict";

//CONSTANTS
const LATEST = "latest-projects";
const MOST_POPULAR = "most-popular-projects";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getProjectsOrdered(req, res, next) {
  const { projectsOrder } = req.params;

  let connection;
  try {
    connection = await mysqlPool.getConnection();

    //query to obtain the data
    let sqlQuery;

    switch (projectsOrder) {
      case LATEST:
        sqlQuery = "SELECT * FROM projectsAndFollowers";

        break;
      case MOST_POPULAR:
        sqlQuery =
          "SELECT * FROM projectsAndFollowers ORDER BY number_of_followers DESC";
        break;
    }

    const [data] = await connection.execute(sqlQuery);

    connection.release();

    return res.status(200).send(data);
  } catch (e) {
    if (connection) {
      connection.release();
    }

    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getProjectsOrdered;
