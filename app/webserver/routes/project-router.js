"use strict";

const express = require("express");

const followProject = require("../controllers/project/follow-project-controller");

const router = express.Router();

router.post("/project/:projectId", followProject);

module.exports = router;
