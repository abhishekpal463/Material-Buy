const { isLoggedIn } = require('../middleware/auth');
const express=require("express");
const session = require("express-session");
const localstrategy = require("passport-local");
const flash = require("connect-flash");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

const sessionconfig = {
    name: "session",
    secret: "mysecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: Date.now() +  60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  };

router.use(session(sessionconfig));
router.use(flash());
router.use(passport.initialize());
router.use(passport.session());


router.use(passport.initialize());
router.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use(function (req, res, next) {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

router.get("/",(req,res)=>{
    res.render("home");
  })


router.get("/signup", function (req, res) {
    res.render("usersignup");
});

router.post("/register", async function (req, res) {
    try {
      const { email, username, password,first_name,last_name } = req.body;
      const user = new User({ email, username,first_name,last_name});
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, function (err) {
        if (err) {
          conlose.log("user already registered");
          return next(err);
        }
        req.flash("success", "Welcome");
        res.redirect("/user");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  });
  
router.get("/user", isLoggedIn, function (req, res) {
    res.render("user");
  });
  
router.post("/login",
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/signup",
    }),
    async function (req, res) {
      req.flash("success", "Welcome");
      res.redirect("/user");
    }
  );
  
router.get("/logout",(req,res)=>{
    res.clearCookie("session");
    req.logout();
    req.session.destroy(function (err) {
      res.redirect('/');
  });
    req.flash("success", "Logged out successfully");
    res.render("home");
  })
  
router.post("/logout", function (req, res) {
    req.logout();
    req.flash("success", "Logged out successfully");
    res.redirect("/");
  });
  


module.exports = router;