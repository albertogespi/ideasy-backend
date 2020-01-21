"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors()); //esto permite la conexión frontend-backend, en teoría
app.use(express.json());

const { accountRouter, userRouter } = require("./routes");

app.get("/", (req, res) => res.send("Bienvenidos a nuestro portal de ideas!"));

app.use("/api", accountRouter);
app.use("/api", userRouter);

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
