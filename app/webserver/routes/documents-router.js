"use strict";

const express = require("express");
const multer = require("multer");

const checkAccount = require("../controllers/account/check-account-controller");
const getDocuments = require("../controllers/documents/get-documents-controller");
const uploadDocument = require("../controllers/documents/upload-document-controller");
const uploadRating = require("../controllers/documents/upload-document-rating-controller");
const deleteDocument = require("../controllers/documents/delete-document-controller");
const upload = multer();
const router = express.Router();

router.post(
	"/documents/projects/:projectId",
	checkAccount,
	upload.single("document"),
	uploadDocument,
);
router.get("/documents/projects/:projectId", getDocuments);
router.post("/documents/:docId", checkAccount, uploadRating);
router.delete("/documents/:docId", checkAccount, deleteDocument);

module.exports = router;
