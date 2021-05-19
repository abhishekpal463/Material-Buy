const passport = require("passport");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const Admin = require("../models/admin");
const flash = require("connect-flash");
const multer = require('multer')
const bcrypt = require("bcryptjs");
const path  =require('path')
const SubCategory=require('../models/subcategory');
let d  = Date.now()

let storage = multer.diskStorage({
  destination : __dirname + '/profile', 
  filename: function (req, file, cb) {
      const uniqueSuffix = 'avatar' + path.extname(file.originalname)
      cb(null, d + uniqueSuffix)
  }
});

let upload = multer({
  storage : storage
});


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
    req.logOut();
    req.session.user_id = null;
    res.redirect("/admin/login");
  });

/////////////////////////create sub product//////////////////////////////////////////////////////////////

router.get("/createSubCategory",(req,res)=>{
  res.render("createSubCategory")
})

router.post("/createSubCategory", upload.single('user') ,async function(req, res) {
  console.log(__dirname);
  console.log(req.file);
    const result = new SubCategory({
      name: req.body.name,
      subtitle: req.body.subtitle,
      image: (() => {
        if (req.file) {
          return '/profile/' + d + 'avatar' + path.extname(req.file.originalname);
        }
        else if (result.image == '/images/1.png' || result.image == undefined) {
          return '/images/1.png';
        }
        else {
          return result.profile;
        }
      })()
    });
  await result.save().then(()=>{
    console.log("save successfully");
  });
  console.log(result);;
  return res.redirect("/createSubCategory");
});


/////////////////////////////////////////////////////edit product///////////////////////////////////

router.get("/updateSubCategory" , (req,res)=>{
  res.render("updateSubCategory")
});

router.post("/updateSubCategory",upload.single('user'), async (req,res)=>{
  SubCategory.updateOne({
    _id: req.body.id
  }, {
    name: req.body.name,
    subtitle: req.body.subtitle,
    image:(() => {
      if (req.file) {
        return '/profile/' + d + 'avatar' + path.extname(req.file.originalname);
      }
      else if (result.image == '/images/1.png' || result.image == undefined) {
        return '/images/1.png';
      }
    })() 
  },
  function(err) {
    if (err) {
      const result="Product doesn't Exist!"
      console.log(result);
      res.redirect("/");
    } else {
      const result="Product updated successfully."
      console.log(result);
      res.redirect("/updateSubCategory");
    }
  });
});


//////////////////////////////////////delete////////////////////////////////////////////

router.get("/deleteSubCategory" ,(req,res)=>{
  res.render("deleteSubCategory");
})

router.post("/deleteSubCategory", function(req, res) {
  SubCategory.deleteOne({_id:req.body.id},function(err){
    if(!err){
          const result="Product deleted successfully."
          console.log(result);
          res.redirect("/deleteSubCategory");
  }else{
    const result="Product doesn't Exist!"
    console.log(result);
    res.redirect("/");
  }
});
});
 
//////////////////////////////show Sub Category

router.get("/showSubCategory", function(req, res) {

  SubCategory.find(function(err,products){
    if(err){
      console.log("No Sub Catogery Exits");
      console.log(err);
    }else{
      console.log(products);
      res.render("showSubCategory", {
        products: products
      });
    }
  });
});



module.exports = router;