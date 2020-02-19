"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function unfollowProject(req, res, next) {
	const { userId } = req.claims;
	const { projectId } = req.params;

	try {
		//CHECK USER DOESN'T FOLLOW THAT PROJECT YET
		const sqlQuery = `SELECT * FROM users_projects WHERE user_id = '${userId}' AND project_id = '${projectId}'`;

		const connection = await mysqlPool.getConnection();
		const [rows] = await connection.query(sqlQuery);
		connection.release();

		if (rows.length === 0) {
			return res.status(409).send("El usuario no sigue a ese proyecto.");
		}
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		const sqlQuery = `DELETE FROM users_projects WHERE user_id = '${userId}' AND project_id = '${projectId}'`;
		await connection.query(sqlQuery);

		connection.release();

		res.status(201).send("se ha dejado de seguir el proyecto con éxito.");
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}
}

module.exports = unfollowProject;
