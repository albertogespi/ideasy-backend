"use strict";

const express = require("express");

const getProject = require("../controllers/project/get-project-controller");
const followProject = require("../controllers/project/follow-project-controller");
const checkAccount = require("../controllers/account/check-account-controller");

const router = express.Router();

router.get("/project/:projectId", checkAccount, getProject);
router.post("/project/:projectId", checkAccount, followProject);

module.exports = router;
