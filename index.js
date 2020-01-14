'use strict';

const webServer = require('./app/webserver');

const port = 8000;

async function initApp() {
  try {
    await webServer.listen(port);
    console.log(`server listening on port ${port}`);
  } catch (e) {
    console.error(e);
  }
}

initApp();
