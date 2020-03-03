"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  app.use(express.static("http://localhost:8000/build"));
  app.use(express.static(path.join(__dirname, "http://localhost:8000/build")));
}

app.use((req, res, next) => {
  const accessControlAllowHeaders = ["Location"];

  res.header(
    "Access-Control-Allow-Headers",
    accessControlAllowHeaders.join(",")
  );
  res.header(
    "Access-Control-Expose-Headers",
    accessControlAllowHeaders.join(",")
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
  searchRouter
} = require("./routes");

app.get("/", (req, res) => res.send("Bienvenidos a nuestro portal de ideas!"));

app.use("/api", accountRouter);
app.use("/api", documentsRouter);
app.use("/api", userRouter);
app.use("/api", homeRouter);
app.use("/api", projectRouter);
app.use("/api", projectsRouter);
app.use("/api", projectRouter);
app.use("/api", searchRouter);

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
