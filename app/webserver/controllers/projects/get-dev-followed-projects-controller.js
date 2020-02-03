"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getFollowedProjects(req, res, next) {
	const { userId } = req.params;
	const filters = req.query;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//query to obtain the data
		let sqlQuery = `SELECT projects.* FROM projects INNER JOIN users_projects ON projects.project_id = users_projects.project_id WHERE users_projects.user_id = "${userId}"`;

		if (Object.keys(filters).length !== 0) {
			for (const filter in filters) {
				sqlQuery += ` AND ${filter} = "${filters[filter]}"`;
			}
		}

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

module.exports = getFollowedProjects;
