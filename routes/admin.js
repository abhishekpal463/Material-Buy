const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const Admin = require("../models/admin");
const flash = require("connect-flash");

const bcrypt = require("bcryptjs");

const localstrategy = require("passport-local");
const { isALoggedIn } = require("../middleware/middleware");
const express = require('express');
const router = express.Router();

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
  router.use(session(sessionconfig));
  router.use(flash());
  router.use(passport.initialize());
  router.use(passport.session());
  router.use(passport.initialize());
  router.use(passport.session());
  router.use(function (req, res, next) {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
  });


router.get("/admin/signup", function (req, res) {
    res.render("signup");
  });
  router.get("/admin/login", function (req, res) {
    res.render("login");
  });
  router.post("/admin/register", async function (req, res) {
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
  router.get("/dashboard", isALoggedIn, function (req, res) {
    res.render("adminDashboard");
  });
  router.post("/admin/login", async function (req, res) {
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
  router.post("/admin/logout", function (req, res) {
    req.session.user_id = null;
    res.redirect("/admin/login");
  });

  module.exports = router;