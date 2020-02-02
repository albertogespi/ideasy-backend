"use strict";

const express = require("express");

const router = express.Router();

const createAccount = require("../controllers/account/create-account-controller");
router.post("/account", createAccount);

module.exports = router;
