const passport = require("passport");
const mongoose = require("mongoose");
const session = require("express-session");
const Vendor = require("../models/vendor");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const localstrategy = require("passport-local");
const { isALoggedIn } = require("../middleware/middleware");
const express=require('express');
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


router.get("/vendor/signup", function (req, res) {
    res.render("vsignup");
  });
  router.get("/vendor/login", function (req, res) {
    res.render("vlogin");
  });
  router.post("/vendor/register", async function (req, res) {
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
  router.get("/vdashboard", isALoggedIn, function (req, res) {
    res.render("vendorDashboard");
  });
  router.post("/vendor/login", async function (req, res) {
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
  router.post("/admin/logout", function (req, res) {
    req.session.user_id = null;
    res.redirect("/admin/login");
  });
  router.post("/vendor/logout", function (req, res) {
    req.session.user_id = null;
    res.redirect("/vendor/login");
  });

  module.exports=router;