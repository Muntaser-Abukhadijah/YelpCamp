var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function (req, res) {
  Campground.find({}, function (err, campgrounds) {
    if (err) {

      console.log(err);
    } else {

      res.render("campgrounds/index", { campgrounds: campgrounds });

    }
  });
});

router.post("/", middleware.isLoggedIn, function (req, res) {
  Campground.create(
    {
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      price: req.body.price,
      author: {
        id: req.user._id,
        username: req.user.username
      }
    }, function (err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/campgrounds");
      }
    }
  );
});

router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render("campgrounds/new");
});

router.get("/:id", function (req, res) {
  Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", { campground: campground });
    }
  });
});

// edit
router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    res.render("campgrounds/edit", { campground: campground });
  });
});


//update 

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
     //find and update the correct campground, the redirect to the show page.
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, campground) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds/" + campground._id);
    }
  });
});

// destroy

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
  Campground.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  req.flash("error","Please login first!")
  res.redirect("/login");
};

/*function checkCampgroundOnwerShip(req, res, next) {
  if (req.isAuthenticated()) {
      Campground.findById(req.params.id, function (err, foundCampground) {
          if (err) {
              req.flash("error","Campgroiund Not Found!");
              res.redirect("back");
          } else {
              if (foundCampground.author.id.equals(req.user._id)) {
                  next();
              } else {
                  req.flash("error","You don't have permission to do that!");
                  res.redirect("back");
              }
          }
      });
  } else {
      req.flash("error","You need do be logged in first!");
      res.redirect("back");
  }
}*/

module.exports = router;
