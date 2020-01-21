"use strict";

const express = require("express");
const multer = require("multer");
const checkAccount = require("../controllers/account/check-account-controller");
const uploadAvatar = require("../controllers/user/upload-avatar-controller");
const updateName = require("../controllers/user/update-name-controller");

const upload = multer();
const router = express.Router();

router.post(
  "/users/avatar",
  checkAccount,
  upload.single("avatar"),
  uploadAvatar
);

router.post("/users/name", checkAccount, updateName);

module.exports = router;
