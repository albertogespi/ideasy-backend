"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getUserProjects(req, res, next) {
	const { userId } = req.params;
	const filters = req.query;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//query to obtain the data
		let sqlQuery = `SELECT * FROM projectsAndFollowers WHERE user_id = "${userId}"`;

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

module.exports = getUserProjects;
