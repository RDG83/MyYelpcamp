const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Campground = require("./models/campgrounds");
const Comment = require("./models/comment");
const seedDB = require("./seeds");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const methodOverride = require("method-override");
const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const indexRoutes = require("./routes/index");
const flash = require("connect-flash");

// seedDB();
mongoose.connect("mongodb://localhost:27017/yelpcamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

app.use(
  require("express-session")({
    secret: "Twee maal twee is vijf",
    resave: false,
    saveUninitialized: false
  })
);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

// function isLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   req.flash("error", "You need to be logged in to do that.");
//   res.redirect("/login");
// }

app.get("*", function(req, res) {
  res.send("Webpage not found, please return to the homepage");
});

app.listen(3000, function() {
  console.log("Server now live and listening on port 3000");
});
