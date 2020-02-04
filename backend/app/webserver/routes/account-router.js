"use strict";

const express = require("express");

const router = express.Router();

const checkAccount = require("../controllers/account/check-account-controller");
const createAccount = require("../controllers/account/create-account-controller");
const deleteAccount = require("../controllers/account/delete-account");
const login = require("../controllers/account/login-controller");

router.post("/account/new", createAccount);
router.post("/account/login", login);
router.delete("/account", checkAccount, deleteAccount);

module.exports = router;
