"use strict";

const accountRouter = require("./account-router");
const authRouter = require("./auth-router");
const userRouter = require("./user-router");
const homeRouter = require("./home-router");
const projectsRouter = require("./project-router");

module.exports = {
	accountRouter,
	authRouter,
	userRouter,
	homeRouter,
	projectsRouter,
};
