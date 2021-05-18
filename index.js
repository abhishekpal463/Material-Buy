const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

const flash = require("connect-flash");
mongoose.connect("mongodb+srv://abhishekpal463:Abhipal123@cluster0-wlpqz.mongodb.net/Orions", {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function () {
  console.log("Database Connected");
});


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

//ADMIN

const admin = require('./routes/admin');
app.use("/",admin);


//VENDOR
const vendor = require('./routes/vendor');
app.use("/",vendor);

const user=require('./routes/user');
app.use("/",user);


app.listen(5000, function () {
  console.log("On port 5000");
});
