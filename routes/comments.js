var express = require("express");
var router = express.Router({ mergeParams: true });
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", { campground: campground });
    }
  });
});

//Comments create
router.post("/", middleware.isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
      req.flash("error", "Something went wrong!");
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function (err, comment) {
        if (err) {
          console.log(err);
          res.redirect("/campgrounds");
        } else {
          // Save comment info.
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
          campground.comments.push(comment);
          campground.save();
          req.flash("success", "Successfully added comment");
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

//comment edit route

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
  Comment.findById(req.params.comment_id, function (err, comment) {
    if (err) {
      res.redirect("back");
    } else {
      res.render("comments/edit", { campground_id: req.params.id, comment: comment });
    }
  });
});

// comment update

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, comment) {
    if (err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//Comment destroy

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
  Comment.findByIdAndRemove(req.params.comment_id, function (err) {
    if (err) {
      res.redirect("back");
    } else {
      req.flash("success", "Comment deleted");
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});


/*function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.flash("error","Please login first!")
  res.redirect("/login");
};



function checkCommentOwnership(req, res, next) {
  if (req.isAuthenticated()) {
      Comment.findById(req.params.comment_id, function (err, foundComment) {
          if (err) {
              res.redirect("back");
          } else {
              if (foundComment.author.id.equals(req.user._id)) {
                  next();
              } else {
                  req.flash("error","You don't have permission to do that!");
                  res.redirect("back");
              }
          }
      });
  } else {
      req.flash("error","You need to be logged in to do that!");
      res.redirect("back");
  }
}
*/

module.exports = router;
