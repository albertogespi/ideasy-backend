"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getRating(req, res, next) {
	const { userId } = req.params;

	try {
		const connection = await mysqlPool.getConnection();
		const sqlQuery = `SELECT COALESCE(AVG(rating), 0) AS rating_average 
    FROM documents WHERE user_id = ?`;

		const [rows] = await connection.execute(sqlQuery, [userId]);
		connection.release();

		const [rating] = rows;

		return res.status(200).send(rating);
	} catch (e) {
		console.error(e);
		return res.status(500).send();
	}
}

module.exports = getRating;
