"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getHomeProjects(req, res, next) {
	const filters = req.query;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//query to obtain the data
		let sqlQuery = "SELECT * FROM projectsAndFollowers WHERE closed_at IS NULL";

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

module.exports = getHomeProjects;
