"use strict";

require("dotenv").config();
const webServer = require("./app/webserver");
const mysqlPool = require("./app/database/mysql-pool");

const port = 8000;

async function initApp() {
	try {
		await mysqlPool.connect();
		await webServer.listen(port);
		console.log(`server listening on port ${port}`);
	} catch (e) {
		console.error(e);
	}
}

initApp();
