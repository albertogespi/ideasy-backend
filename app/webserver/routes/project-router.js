"use strict";

const express = require("express");

const getProject = require("../controllers/project/get-project-controller");
const followProject = require("../controllers/project/follow-project-controller");
const getUsersFollowingProject = require("../controllers/project/get-users-following-project-controller");
const checkAccount = require("../controllers/account/check-account-controller");

const router = express.Router();

router.get("/project/followers/:projectId", getUsersFollowingProject);
router.post("/project/followers/:projectId", checkAccount, followProject);
router.get("/project/:projectId", checkAccount, getProject);

module.exports = router;
