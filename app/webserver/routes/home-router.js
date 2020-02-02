"use strict";

const express = require("express");

const router = express.Router();

const getHomeProjects = require("../controllers/home/get-home-projects-controller");
const getProjectsOrdered = require("../controllers/home/get-ordered-projects-controller");

router.get("/home", getHomeProjects);
router.get("/home/:projectsOrder", getProjectsOrdered); //obtiene una lista ordenada como le indiquemos.

module.exports = router;
