const express = require("express");
const path = require("path");
const app = express();
const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const Admin = require("./models/admin");
const Vendor = require("./models/vendor");
const localstrategy = require("passport-local");
const flash = require("connect-flash");
const dburl = "mongodb://localhost:27017/orion";
const { isALoggedIn } = require("./middleware");
const bcrypt = require("bcryptjs");

mongoose.connect(dburl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Database Connected");
});
const sessionconfig = {
  name: "session",
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionconfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//ADMIN

app.get("/admin/signup", function (req, res) {
  res.render("signup");
});
app.get("/admin/login", function (req, res) {
  res.render("login");
});
app.post("/admin/register", async function (req, res) {
  const { username, password } = req.body;
  if (username === "Admin") {
    const code = await bcrypt.hash(password, 12);
    const user = new Admin({
      username,
      password: code,
    });
    await user.save().catch(() => {
      req.flash("error", "Username or Email already registered");
      res.redirect("/admin/signup");
    });
    req.session.user_id = user._id;
    res.redirect("/dashboard");
  } else {
    req.flash("error", "Credentials must be of an Admin");
    res.redirect("/admin/signup");
  }
});
app.get("/dashboard", isALoggedIn, function (req, res) {
  res.render("adminDashboard");
});
app.post("/admin/login", async function (req, res) {
  const { username, password } = req.body;
  const founduser = await Admin.findAndValidate(username, password).catch(
    (err) => {
      console.log(err);
      req.flash("error", "Invalid Credentials");
      res.redirect("/admin/login");
    }
  );
  if (founduser) {
    req.session.user_id = founduser._id;
    res.redirect("/dashboard");
  } else {
    req.flash("error", "Invalid Credentials");
    res.redirect("/admin/login");
  }
});
app.post("/admin/logout", function (req, res) {
  req.session.user_id = null;
  res.redirect("/admin/login");
});

//VENDOR

app.get("/vendor/signup", function (req, res) {
  res.render("vsignup");
});
app.get("/vendor/login", function (req, res) {
  res.render("vlogin");
});
app.post("/vendor/register", async function (req, res) {
  const { username, password } = req.body;
  const code = await bcrypt.hash(password, 12);
  const user = new Vendor({
    username,
    password: code,
  });
  await user.save().catch(() => {
    req.flash("error", "Username or Email already registered");
    res.redirect("/vendor/signup");
  });
  req.session.user_id = user._id;
  res.redirect("/vdashboard");
});
app.get("/vdashboard", isALoggedIn, function (req, res) {
  res.render("vendorDashboard");
});
app.post("/vendor/login", async function (req, res) {
  const { username, password } = req.body;
  const founduser = await Vendor.findAndValidate(username, password).catch(
    (err) => {
      console.log(err);
      req.flash("error", "Invalid Credentials");
      res.redirect("/vendor/login");
    }
  );
  if (founduser) {
    req.session.user_id = founduser._id;
    res.redirect("/vdashboard");
  } else {
    req.flash("error", "Invalid Credentials");
    res.redirect("/vendor/login");
  }
});
app.post("/admin/logout", function (req, res) {
  req.session.user_id = null;
  res.redirect("/admin/login");
});
app.post("/vendor/logout", function (req, res) {
  req.session.user_id = null;
  res.redirect("/vendor/login");
});
app.listen(3000, function () {
  console.log("On port 3000");
});
