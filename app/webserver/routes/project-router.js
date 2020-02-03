"use strict";

const express = require("express");

// const createProject = require("../controllers/projects/create-project-controller");
const getUserProjects = require("../controllers/projects/get-user-projects-controller");

const router = express.Router();

// router.post("/projects/new", createProject);
router.get("/projects/:userId", getUserProjects);

module.exports = router;
