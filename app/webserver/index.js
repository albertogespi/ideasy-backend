'use strict';

const express = require('express');

const app = express();

app.use(express.json());

const { accountRouter } = require('./routes/index');

app.get('/', (req, res) => res.send('Bienvenidos a nuestro portal de ideas!'));

app.use('/api', accountRouter);

let server = null;

async function listen(port) {
  if (server) {
    return server;
  }
  try {
    server = await app.listen(port);
    return server;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
module.exports = { listen };
