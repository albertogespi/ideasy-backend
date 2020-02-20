"use strict";

//MYSQL POOL CONNECTION
const mysqlPool = require("../../../database/mysql-pool");

async function getSearchResults(req, res, next) {
	const searchData = req.query;

	let connection;
	try {
		connection = await mysqlPool.getConnection();

		//query to obtain the data
		let sqlQueryProjects = "SELECT * FROM projectsAndFollowers";
		let sqlQueryUsers = "SELECT * FROM users";

		const searchString = searchData["search"];

		if (searchString === undefined || searchString === "") {
			res.status(400).send("no data available");
		}

		sqlQueryProjects += ` WHERE user_name LIKE "%${searchString}%" OR title LIKE "%${searchString}%" OR description LIKE "%${searchString}%" OR details LIKE "%${searchString}%"`;
		sqlQueryUsers += ` WHERE name LIKE "%${searchString}%" OR surname LIKE "%${searchString}%" OR contact_web LIKE "%${searchString}%" OR contact_email LIKE "%${searchString}%"`;

		const [dataProjects] = await connection.execute(sqlQueryProjects);
		const [dataUsers] = await connection.execute(sqlQueryUsers);
		connection.release();

		const searchResults = { projects: dataProjects, users: dataUsers };
		return res.status(200).send(searchResults);
	} catch (e) {
		if (connection) {
			connection.release();
		}

		console.error(e);
		return res.status(500).send();
	}
}

module.exports = getSearchResults;
