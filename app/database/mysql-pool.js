"use strict";

const mysql = require("mysql2/promise");

const {
	MYSQL_HOST,
	MYSQL_USER,
	MYSQL_DATABASE,
	MYSQL_PASSWORD,
	MYSQL_PORT,
} = process.env;

let pool = null;

/**
 * This function allowes us to establish the first connection to the ddbb.
 * It generates the pool connection with all config and keys given.
 */
async function connect() {
	//config and keys:
	const options = {
		connectionLimit: 10,
		host: MYSQL_HOST,
		user: MYSQL_USER,
		password: MYSQL_PASSWORD,
		database: MYSQL_DATABASE,
		port: MYSQL_PORT,
		timezone: "Z",
	};

	//1 create pool using config
	pool = mysql.createPool(options);

	try {
		//2.1 build conexion
		const connection = await pool.getConnection();

		//2.2 free conexion
		if (connection) {
			connection.release();
		}
	} catch (e) {
		throw e;
	}
}

/**
 * This function allowes us to re-connect to an already-builded pool connection to the ddbb.
 */
async function getConnection() {
	//connection? (!connection = error)
	if (pool === null) {
		throw new Error("Not MySQL connection established. Please, connect first.");
	}

	//!error = connection
	const connection = await pool.getConnection();
	return connection;
}

module.exports = {
	connect,
	getConnection,
};
