"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getUser(req, res, next) {
  const { userId } = req.claims;

  try {
    const connection = await mysqlPool.getConnection();

    const sqlQuery = `SELECT * FROM users WHERE user_id = ?`;
    const [rows] = await connection.execute(sqlQuery, [userId]);
    connection.release();

    if (rows.length !== 1) {
      return res.status(404).send("el usuario no existe");
    }

    const [user] = rows;

    return res.status(200).send(user);
  } catch (e) {
    console.error(e);
    return res.status(500).send;
  }
}

module.exports = getUser;
