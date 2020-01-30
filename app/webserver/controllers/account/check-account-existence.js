"use strict";

const mysqlPool = require("../../../database/mysql-pool");

/**
 * This function checks whether the email given as a parameter is already stored
 * in the database (it already exists an user with that email) and returns a data response.
 */
async function checkExistenceAccount(email) {
	const sqlQuery = `SELECT user_id, email, password, avatar_url, role
    FROM users
    WHERE email = '${email}'`;

	const connection = await mysqlPool.getConnection();
	const [rows] = await connection.query(sqlQuery);
	connection.release();

	return rows;
}

module.exports = checkExistenceAccount;
