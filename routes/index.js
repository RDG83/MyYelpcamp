const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function(req, res) {
  res.render("landing", { currentUser: req.user });
});

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  if (req.body.adminCode === "pasta123") {
    newUser.isAdmin = true;
  }
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "You are signed up");
      res.redirect("/campgrounds");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }),
  function(req, res) {}
);

router.get("/logout", function(req, res) {
  req.logOut();
  req.flash("error", "You are logged out");
  res.redirect("/campgrounds");
});

module.exports = router;
