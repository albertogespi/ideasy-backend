"use strict";

const express = require("express");

const closeProject = require("../controllers/project/close-project-controller");
const getProject = require("../controllers/project/get-project-controller");
const followProject = require("../controllers/project/follow-project-controller");
const getUsersFollowingProject = require("../controllers/project/get-users-following-project-controller");
const checkAccount = require("../controllers/account/check-account-controller");
const updateProject = require("../controllers/project/update-project-controller");
const unfollowProject = require("../controllers/project/unfollow-project-controller");

const router = express.Router();

router.get("/project/followers/:projectId", getUsersFollowingProject);
router.post("/project/followers/:projectId", checkAccount, followProject);
router.delete("/project/followers/:projectId", checkAccount, unfollowProject);
router.get("/project/:projectId", getProject);
router.post("/project/:projectId", checkAccount, closeProject);
router.put("/project/:projectId", checkAccount, updateProject);

module.exports = router;
