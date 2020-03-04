"use strict";

const express = require("express");

const checkAccount = require("../controllers/account/check-account-controller");
const createProject = require("../controllers/projects/create-project-controller");
const getOrgProjects = require("../controllers/projects/get-org-projects-controller");
const getFollowedProjects = require("../controllers/projects/get-dev-followed-projects-controller");
const getContributedProjects = require("../controllers/projects/get-dev-contributed-projects-controller");
const getAvgRatings = require("../controllers/projects/get-dev-avg-doc-rating-controller");
const getNumberOfContributions = require("../controllers/projects/get-dev-number-of-contributions-controller");

const router = express.Router();

router.get("/projects/contributed/number/:userId", getNumberOfContributions);
router.get("/projects/contributed/:userId", getContributedProjects);
router.get("/projects/contributed/number/:userId", getNumberOfContributions);
router.get("/projects/followed/:userId", getFollowedProjects);
router.get("/projects/ratings/:userId", getAvgRatings);
router.get("/projects/:userId", getOrgProjects);
router.post("/projects/new", checkAccount, createProject);

module.exports = router;
