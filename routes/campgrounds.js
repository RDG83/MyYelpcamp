const express = require("express");
const router = express.Router();
const Campground = require("../models/campgrounds");
const middleware = require("../middleware");

// INDEX
router.get("/", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.user);
      res.render("campgrounds/index", { campgrounds: campgrounds, currentUser: req.user });
    }
  });
});

// CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
  let newcampground = req.body.newcampground;
  let newimage = req.body.newimg;
  let newdescription = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newitem = {
    name: newcampground,
    image: newimage,
    description: newdescription,
    author: author
  };
  Campground.create(newitem, function(err, addedCamp) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/campgrounds");
    }
  });
});

// NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("campgrounds/new", { currentUser: req.user });
});

// SHOW
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCampgrounds) {
      if (err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        res.render("campgrounds/show", { campground: foundCampgrounds });
      }
    });
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkOwnerCampground, function(req, res) {
  Campground.findById(req.params.id, function(err, foundCampgrounds) {
    res.render("campgrounds/edit", { campground: foundCampgrounds, currentUser: req.user });
  });
});

// UPDATE ROUTE
router.put("/:id", middleware.checkOwnerCampground, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, foundCampground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

router.delete("/:id", middleware.checkOwnerCampground, function(req, res) {
  Campground.findByIdAndDelete(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    }
    res.redirect("/campgrounds");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
