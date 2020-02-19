"use strict";

const cloudinary = require("cloudinary").v2;
const mysqlPool = require("../../../database/mysql-pool");
const uuid = require("uuid/v4");

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadDocument(req, res, next) {
	const { file } = req;
	const docId = uuid();
	const { projectId } = req.params;
	const { userId } = req.claims;

	if (!file || !file.buffer) {
		return res.status(400).send({
			message: "invalid document",
		});
	}

	const title = file.originalname;
	console.log(file);

	cloudinary.uploader
		.upload_stream(
			{
				resource_type: "raw",
				public_id: userId,
				format: "pdf",
			},
			async (err, result) => {
				if (err) {
					console.error(err);
					return res.status(400).send(err);
				}

				const secureUrl = result.secure_url;

				let connection;
				try {
					connection = await mysqlPool.getConnection();
					const now = new Date()
						.toISOString()
						.replace("T", " ")
						.substring(0, 19);

					const sqlQuery = `INSERT INTO documents 
          SET doc_id = ?, project_id = ?, 
          user_id = ?, title = ?, 
          file_url = ?, uploaded_at = ?`;

					connection.query(sqlQuery, [
						docId,
						projectId,
						userId,
						title,
						secureUrl,
						now,
					]);
					connection.release();

					res.header("Location", secureUrl);
					return res.status(201).send("documento subido");
				} catch (e) {
					if (connection) {
						connection.release();
					}
					console.error(e);
					return res.status(500).send(e.message);
				}
			},
		)
		.end(file.buffer);
}

module.exports = uploadDocument;
