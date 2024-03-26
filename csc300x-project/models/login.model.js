"use strict";
const db = require("../models/db-conn");

function createUser(username, password, status, tier) {
    let sql = `INSERT INTO Users (Username, Password, Status, Tier) VALUES (?, ?, ?, ?)`;
    const params = [username, password, status, tier];
    return db.run(sql, params);
}

// function loginPage(req, res) {
//     const filePath = path.resolve(__dirname, '../views/login.html');
//         res.sendFile(filePath);
// }


module.exports = {
    // loginPage,
    createUser,
};

