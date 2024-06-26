"use strict";

const express = require("express");
const app = express();
const multer = require("multer");
const session = require("express-session");
const path = require("path");

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const imageUpload = multer({ storage: imageStorage });

const uploadStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: uploadStorage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.set('partials', path.join(__dirname, 'views', 'partials'));

app.use(session({
  secret: 'secret_key',
  resave: false,
  saveUninitialized: false
}));

const adminRouter = require("./routes/admin.route")(imageUpload, upload);
const userRouter = require("./routes/user.route");
const loginRouter = require("./routes/login.route");

app.use("/public", express.static('public'));
app.use("/images", express.static('images'));
app.use("/", adminRouter);
app.use("/", userRouter);
app.use("/", loginRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("App listening at http://localhost:" + PORT);
});