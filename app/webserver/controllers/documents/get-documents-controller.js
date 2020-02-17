"use strict";

const mysqlPool = require("../../../database/mysql-pool");

async function getDocuments(req, res, next) {
	const { projectId } = req.params;

	try {
		const connection = await mysqlPool.getConnection();
		const sqlQuery = `SELECT * FROM documentsAndUsers WHERE project_id = ?`;
		const [documents] = await connection.execute(sqlQuery, [projectId]);
		connection.release();

		return res.status(200).send(documents);
	} catch (e) {
		console.error(e);
		return res.status(500).send();
	}
}

module.exports = getDocuments;
