"use strict";

const accountRouter = require("./account-router");
const authRouter = require("./auth-router");
const documentRouter = require("./document-router");
const userRouter = require("./user-router");

module.exports = { accountRouter, authRouter, documentRouter, userRouter };
