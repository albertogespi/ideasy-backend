"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors()); //esto permite la conexión frontend-backend, en teoría
app.use(express.json());

const {
	accountRouter,
	documentRouter,
	userRouter,
	homeRouter,
	projectsRouter,
	projectRouter,
} = require("./routes");

app.get("/", (req, res) => res.send("Bienvenidos a nuestro portal de ideas!"));

app.use("/api", accountRouter);
app.use("/api", documentRouter);
app.use("/api", userRouter);
app.use("/api", homeRouter);
app.use("/api", projectsRouter);
app.use("/api", projectRouter);

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
