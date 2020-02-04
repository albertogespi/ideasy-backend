"use strict";

const express = require("express");
const multer = require("multer");

const checkAccount = require("../controllers/account/check-account-controller");
const getDocuments = require("../controllers/documents/get-document-controller");
const uploadDocument = require("../controllers/documents/upload-document-controller");
const uploadRating = require("../controllers/documents/upload-document-rating-controller");

const upload = multer();
const router = express.Router();

router.get("/documents/:projectId", checkAccount, getDocuments);

router.post(
  "/documents/:projectId",
  checkAccount,
  upload.single("document"),
  uploadDocument
);

router.post("/documents/:projectId/:docId", checkAccount, uploadRating);

module.exports = router;
