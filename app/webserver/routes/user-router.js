"use strict";

const express = require("express");
const multer = require("multer");

const checkAccount = require("../controllers/account/check-account-controller");
const getProfile = require("../controllers/user/get-profile");
const getUser = require("../controllers/user/get-user");
const uploadAvatar = require("../controllers/user/upload-avatar-controller");
const updateContact = require("../controllers/user/update-contact-controller");
const updateName = require("../controllers/user/update-name-controller");
const updatePassword = require("../controllers/user/update-password-controller");

const upload = multer();
const router = express.Router();

router.get("/users/:userId", getUser);
router.get("/users", checkAccount, getProfile);

router.post(
	"/users/avatar",
	checkAccount,
	upload.single("avatar"),
	uploadAvatar,
);

router.post("/users/contact", checkAccount, updateContact);

router.post("/users/name", checkAccount, updateName);

router.post("/users/password", checkAccount, updatePassword);

module.exports = router;
