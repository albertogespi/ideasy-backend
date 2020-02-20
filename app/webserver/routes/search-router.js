"use strict";

const express = require("express");

const router = express.Router();

const getSearchResults = require("../controllers/search/get-search-results");

router.get("/search", getSearchResults);

module.exports = router;
