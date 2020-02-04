"use strict";

const express = require("express");

const closeProject = require("../controllers/project/close-project-controller");
const getProject = require("../controllers/project/get-project-controller");
const followProject = require("../controllers/project/follow-project-controller");
const checkAccount = require("../controllers/account/check-account-controller");

const router = express.Router();

router.get("/project/:projectId", checkAccount, getProject);
router.post("/project/:projectId", checkAccount, followProject);
router.delete("project/:projectId", checkAccount, closeProject);

module.exports = router;
