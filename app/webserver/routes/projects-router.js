"use strict";

const express = require("express");

// const createProject = require("../controllers/projects/create-project-controller");
const getOrgProjects = require("../controllers/projects/get-org-projects-controller");
const getFollowedProjects = require("../controllers/projects/get-dev-followed-projects-controller");
const getContributedProjects = require("../controllers/projects/get-dev-contributed-projects-controller");

const router = express.Router();

router.get("/projects/contributed/:userId", getContributedProjects);
router.get("/projects/followed/:userId", getFollowedProjects);
router.get("/projects/:userId", getOrgProjects);
// router.post("/projects/new", createProject);

module.exports = router;
