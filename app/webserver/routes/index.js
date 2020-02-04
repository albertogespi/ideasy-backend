"use strict";

const accountRouter = require("./account-router");
const documentsRouter = require("./documents-router");
const userRouter = require("./user-router");
const homeRouter = require("./home-router");
const projectRouter = require("./project-router");
const projectsRouter = require("./projects-router");

module.exports = {
	accountRouter,
	documentsRouter,
	userRouter,
	homeRouter,
	projectRouter,
	projectsRouter,
};
