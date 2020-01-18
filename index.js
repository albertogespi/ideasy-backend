"use strict";

require("dotenv").config();
const webServer = require("./app/webserver");
const mysqlPool = require("./app/database/mysql-pool");

const port = process.env.PORT;

async function initApp() {
  try {
    await mysqlPool.connect();
    await webServer.listen(port);
    console.log(`server listening on port ${port}`);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

initApp();
