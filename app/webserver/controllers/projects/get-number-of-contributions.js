"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getNumberOfContributions(req, res, next) {
	const { userId } = req.params;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//query to obtain the data
		let sqlQuery = `SELECT count(doc_id) AS number_of_contributions FROM documents WHERE documents.user_id = "${userId}" AND documents.deleted_at IS NULL`;

		const [data] = await connection.execute(sqlQuery);
		connection.release();

		const [num] = rows;

		return res.status(200).send(num.number_of_contributions);
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}
}

module.exports = getNumberOfContributions;
