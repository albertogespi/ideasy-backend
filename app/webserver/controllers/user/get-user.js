"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getUser(req, res, next) {
  const { userId } = req.params;

  try {
    const connection = await mysqlPool.getConnection();

    const sqlQuery = `SELECT * FROM users 
    WHERE user_id = ? 
    AND deleted_at IS NULL`;

    const [rows] = await connection.execute(sqlQuery, [userId]);
    connection.release();

    if (rows.length !== 1) {
      return res.status(404).send("el usuario no existe");
    }

    const [user] = rows;

    return res.status(200).send({
      avatarUrl: user.avatar_url,
      name: user.name,
      surname: user.surname,
      contactEmail: user.contact_email,
      contactWeb: user.contact_web,
      role: user.role,
      email: user.email
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send();
  }
}

module.exports = getUser;
