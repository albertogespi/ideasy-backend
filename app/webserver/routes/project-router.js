'use strict';

const express = require('express');

const createProject = require('../controllers/project/create-project-controller');

const router = express.Router();

router.post('/projects/new', createProject);

module.exports = router;
