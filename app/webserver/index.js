"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors()); //esto permite la conexión frontend-backend, en teoría
app.use(express.json());

//este middleware permite al frontend acceder al header location según dijo Yago
app.use((req, res, next) => {
	const accessControlAllowHeaders = ["Location"];

	res.header(
		"Access-Control-Allow-Headers",
		accessControlAllowHeaders.join(","),
	);
	res.header(
		"Access-Control-Expose-Headers",
		accessControlAllowHeaders.join(","),
	);
	next();
});

const {
	accountRouter,
	documentsRouter,
	userRouter,
	homeRouter,
	projectRouter,
	projectsRouter,
} = require("./routes");

app.get("/", (req, res) => res.send("Bienvenidos a nuestro portal de ideas!"));

app.use("/api", accountRouter);
app.use("/api", documentsRouter);
app.use("/api", userRouter);
app.use("/api", homeRouter);
app.use("/api", projectRouter);
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
