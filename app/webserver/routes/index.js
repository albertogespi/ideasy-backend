"use strict";

const accountRouter = require("./account-router");
const authRouter = require("./auth-router");
const documentRouter = require("./document-router");
const userRouter = require("./user-router");
const homeRouter = require("./home-router");
const projectsRouter = require("./projects-router");

module.exports = {
	accountRouter,
	documentRouter,
	userRouter,
	homeRouter,
	projectsRouter,
};
