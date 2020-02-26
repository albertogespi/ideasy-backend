"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getNumberOfContributions(req, res, next) {
	const { userId } = req.params;

	try {
		const connection = await mysqlPool.getConnection();
		const sqlQuery = `SELECT count(doc_id) AS number_of_contributions
    FROM documents WHERE user_id = ? AND deleted_at IS NULL`;

		const [rows] = await connection.execute(sqlQuery, [userId]);
		connection.release();

		const [contributions] = rows;

		return res.status(200).send(`${contributions.number_of_contributions}`);
	} catch (e) {
		console.error(e);
		return res.status(500).send();
	}
}

module.exports = getNumberOfContributions;
