"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function followProject(req, res, next) {
	const { userId } = req.claims;
	const { projectId } = req.params;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		await connection.query("INSERT INTO users_projects SET ?", {
			user_id: userId,
			project_id: projectId,
		});

		connection.release();

		res.status(201).send("proyecto seguido con éxito.");
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}
}

module.exports = followProject;
