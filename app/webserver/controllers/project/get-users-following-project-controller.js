"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getUsersFollowingProject(req, res, next) {
	const { projectId } = req.params;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//query to obtain the data
		let sqlQuery = `SELECT users.* FROM users INNER JOIN users_projects ON users.user_id = users_projects.user_id WHERE users_projects.project_id = ${projectId}`;

		const [data] = await connection.execute(sqlQuery);
		connection.release();

		return res.send(data);
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}
}

module.exports = getUsersFollowingProject;
