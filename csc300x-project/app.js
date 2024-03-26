// 'use strict';
// const express = require('express');
// const app = express();
// const sqlite3 = require('sqlite3');
// const sqlite = require('sqlite');
// const multer = require('multer');
// app.use(multer().none());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// const INVALID_PARAM_ERROR = 400;
// const SERVER_ERROR = 500;
// const SERVER_ERROR_MSG = 'Something went wrong on the server.';

// async function getDBConnection() {
//     const db = await sqlite.open({
//         filename: 'database.db',
//         driver: sqlite3.Database
//     });
//     return db;
// }

// app.get('/view', async function (req, res) {
//     try {
//         let qry = 'SELECT Username, Password, Status FROM Login ORDER BY Username;';
//         let db = await getDBConnection();
//         let menu = await db.all(qry);
//         await db.close();
//         res.json(menu);

//     } catch (err) {
//         res.type('text');
//         res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
//     }
// });

// app.post('/add', async function (req, res) {
//     try {
//         let username = req.body.username;
//         let password = req.body.password;
//         let status = req.body.status;
//         if (!username || !password || !status) {
//             res.status(INVALID_PARAM_ERROR).send('Invalid parameters');
//             return;
//         }
//         let db = await getDBConnection();
//         let qry = 'INSERT INTO Login (Username, Password, Status) VALUES (?, ?, ?);';
//         await db.run(qry, username, password, status);
//         await db.close();
//         res.status(200).send('OK');
//     } catch (err) {
//         res.type('text');
//         res.status(SERVER_ERROR).send(SERVER_ERROR_MSG);
//     }
// });


// const PORT = process.env.PORT || 8000;
// app.listen(PORT);

"use strict";
const express = require("express");
const app = express();
const multer = require("multer");

app.use(multer().none());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const adminRouter = require("./routes/admin.route");
const userRouter = require("./routes/user.route");
const loginRouter = require("./routes/login.route");

app.get("/", (req, res) => {
  res.json({ message: "You are at the home page!" });
});

app.use("/other", express.static('other'));
app.use("/admin", adminRouter);
app.use("/users", userRouter);
app.use("/", loginRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});