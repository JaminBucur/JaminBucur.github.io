"use strict";
const express = require("express");
const router = express.Router();

const loginController = require("../controllers/login.controller");

router.get("/login", loginController.loginPage);

router.post("/create", loginController.createUser);

// router.post("/createUser", loginController.createUser);
// router.post("/login", loginController.login);

module.exports = router; 
