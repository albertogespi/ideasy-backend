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
		let sqlQuery = `SELECT projectsAndFollowers.* FROM projectsAndFollowers INNER JOIN documents ON projectsAndFollowers.project_id = documents.project_id WHERE documents.user_id = "${userId}" GROUP BY projectsAndFollowers.project_id`;

		if (Object.keys(filters).length !== 0) {
			for (const filter in filters) {
				sqlQuery += ` AND ${filter} = "${filters[filter]}"`;
			}
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

module.exports = getContributedProjects;
