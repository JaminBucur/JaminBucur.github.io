"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
;

const model = require("../models/login.model");

function loginPage(req, res) {
    try {
        const filePath = path.resolve(__dirname, '../views/login.html');
        res.sendFile(filePath);
    } catch (err) {
        console.error("Error while rendering login page: " + err.message);
        next(err);
    }
}

// function login(req, res, next) {
//     try {
//         const result = model.login(req.body.Username, req.body.Password);
        
//         if (result) {
//             res.json({ status: 'success' });
//         } else {
//             res.json({ status: 'error', message: 'Incorrect username or password' });
//         }
//     } catch (err) {
//         console.error("Error while logging in ", err.message);
//         next(err);
//     }
// }

function createUser(req, res, next) {
    try {
        const result = model.createUser(req.body.Username, req.body.Password, req.body.Status, req.body.Tier);
        res.json({ status: 'success' });
    } catch (err) {
        console.error("Error while creating user ", err.message);
        next(err);
    }
}

module.exports = {
    loginPage,
    createUser,
    
};