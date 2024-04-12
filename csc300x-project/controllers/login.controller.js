"use strict";

const express = require("express");
const app = express();
const path = require('path')
const multer = require("multer");
app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const model = require("../models/login.model");

function loginPage(req, res) {
    try {
        const error = null;
        res.render("login", { userType: req.session.userType, error });
    } catch (err) {
        console.error("Error while rendering login page: " + err.message);
    }
}

function createUserPage(req, res) {
    try {
        const error = null;
        res.render("createUser", { userType: req.session.userType, error });
    }
    catch (err) {
        console.error("Error while rendering create user page: " + err.message);
    }
}

function login(req, res, next) {
    try {
        const { username, password } = req.body;
        const user = model.getUser(username, password);
        if (user) {
            req.session.userType = user.userType;
            req.session.userID = user.userID;
            req.session.tier = user.tier;

            if (user.userType === 'admin') {
                res.redirect('/bulkUpload');
            } else if (user.userType === 'shopper') {
                res.redirect('/home');
            }
        } else {
            res.render("login", { userType: req.session.userType, error: 'Incorrect Username or Password' });
        }
    } catch (err) {
        console.error("Error while logging in ", err.message);
        next(err);
    }
}

function logout(req, res, next) {
    try {
        req.session.destroy();
        res.redirect('/home');
    } catch (err) {
        console.error("Error while logging out ", err.message);
        next(err);
    }
}

function createUser(req, res, next) {
    try {
        const result = model.createUser(req.body.username, req.body.email, req.body.password, req.body.userType, req.body.tier);
        if (result === 'success') {
            res.redirect('/login');
        } else if (result === 'exists') {
            res.render('createUser', { error: 'Email or username already exists' });
        } else {
            res.render('createUser', { error: 'Failed to create user' });
        }
    } catch (err) {
        console.error("Error while creating user ", err.message);
        next(err);
    }
}

module.exports = {
    loginPage,
    createUserPage,
    createUser,
    login,
    logout
};