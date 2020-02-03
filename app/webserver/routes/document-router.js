"use strict";

const express = require("express");
const multer = require("multer");

const checkAccount = require("../controllers/account/check-account-controller");
const uploadDocument = require("../controllers/documents/upload-document-controller");

const upload = multer();
const router = express.Router();

router.post(
  "/documents/:projectId",
  checkAccount,
  upload.single("document"),
  uploadDocument
);

module.exports = router;
