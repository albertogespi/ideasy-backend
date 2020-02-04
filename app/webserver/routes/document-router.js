"use strict";

const express = require("express");
const multer = require("multer");

const checkAccount = require("../controllers/account/check-account-controller");
const getDocuments = require("../controllers/documents/get-documents-controller");
const getRating = require("../controllers/documents/get-document-rating-controller");
const uploadDocument = require("../controllers/documents/upload-document-controller");
const uploadRating = require("../controllers/documents/upload-document-rating-controller");

const upload = multer();
const router = express.Router();

router.post(
  "/documents/projects/:projectId",
  checkAccount,
  upload.single("document"),
  uploadDocument
);

router.get("/documents/user/:userId", checkAccount, getRating);
router.get("/documents/projects/:projectId", checkAccount, getDocuments);
router.get("/documents/user/:userId", checkAccount, getRating);
router.post("/documents/:docId", checkAccount, uploadRating);

module.exports = router;
