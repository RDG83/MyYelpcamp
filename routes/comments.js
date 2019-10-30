const express = require("express");
const router = express.Router({ mergeParams: true });
const Campground = require("../models/campgrounds");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

// CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err);
        } else {
          req.flash("success", "Comment succesfully added.");
          comment.author.id = req.user.id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// COMMENT EDIT
router.get("/:comment_id/edit", middleware.checkOwnerComment, function(req, res) {
  Comment.findById(req.params.comment_id, function(err, foundComment) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.render("comments/edit", { campground_id: req.params.id, comment: foundComment });
    }
  });
});

// UPDATE COMMENT
router.put("/:comment_id", middleware.checkOwnerComment, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// DELETE COMMENT
router.delete("/:comment_id", middleware.checkOwnerComment, function(req, res) {
  Comment.findByIdAndDelete(req.params.comment_id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted.");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

module.exports = router;
