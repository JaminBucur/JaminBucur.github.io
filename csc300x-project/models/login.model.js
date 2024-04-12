"use strict";
const db = require("../models/db-conn");

function createUser(username, email, password, userType, tier) {
    let sqlCheck = `SELECT * FROM Users WHERE username = ? OR email = ?`;
    const paramsCheck = [username, email];
    const userExists = db.get(sqlCheck, ...paramsCheck);

    if (userExists) {
        return 'exists';
    }

    let sql = `INSERT INTO Users (username, email, password, userType, tier) VALUES (?, ?, ?, ?, ?)`;
    const params = [username, email, password, userType, tier];

    try {
        db.run(sql, params);
        return 'success';
    } catch (error) {
        console.error(error);
        return 'error';
    }
}

function signOut(username) {
    let sql = `DELETE FROM Users WHERE Username = ?`;
    const params = [username];
    return db.run(sql, params);
}

function getUser(username, password) {
    let sql = `SELECT * FROM Users WHERE Username = ? AND Password = ?`;
    const params = [username, password];
    return db.get(sql, ...params);
}

module.exports = {
    createUser,
    signOut,
    getUser,
};

