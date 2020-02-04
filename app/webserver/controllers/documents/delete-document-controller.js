"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function deleteDocument(req, res, next) {
	const { docId } = req.params;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//date of deletion
		const now = new Date();
		const deletedAt = now
			.toISOString()
			.replace("T", " ")
			.substring(0, 19);

		connection.query(
			`UPDATE documents SET deleted_at = "${deletedAt}" WHERE doc_id = "${docId}"`,
		);
		connection.release();

		return res.status(200).send("documento borrado con éxito");
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}
}

module.exports = deleteDocument;
