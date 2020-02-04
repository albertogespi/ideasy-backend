"use strict";

const express = require("express");

const router = express.Router();

const createAccount = require("../controllers/account/create-account-controller");
const login = require("../controllers/account/login-controller");

router.post("/account/new", createAccount);
router.post("/account/login", login);

module.exports = router;
