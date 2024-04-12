"use strict";
const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login.controller");

router.get("/login", loginController.loginPage);
router.get("/logout", loginController.logout);
router.get("/create", loginController.createUserPage);

router.post("/login", loginController.login);
router.post("/create", loginController.createUser);

module.exports = router; 