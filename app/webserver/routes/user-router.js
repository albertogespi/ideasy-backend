"use strict";

const express = require("express");
const multer = require("multer");

const checkAccount = require("../controllers/account/check-account-controller");
const getProfile = require("../controllers/user/get-profile");
const getUser = require("../controllers/user/get-user");
const uploadAvatar = require("../controllers/user/upload-avatar-controller");
const updateProfile = require("../controllers/user/update-profile");

const upload = multer();
const router = express.Router();

router.get("/users/:userId", getUser);
router.get("/users", checkAccount, getProfile);

router.post(
  "/users/avatar",
  checkAccount,
  upload.single("avatar"),
  uploadAvatar
);

router.put("/users/profile", checkAccount, updateProfile);

module.exports = router;
