var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");



// root route
router.get("/", function (req, res) {
  res.render("landing");
});

//=======================
//Auth Routes
//=======================

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", function (req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "You are in YelpCamp  now" + user.username + ", Welcome :)");
      res.redirect("/campgrounds");
    });
  });
});


// show login form

router.get("/login", function (req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/campgrounds",
  failureRedirect: "/login"
}), function (req, res) {
});

// logout  route

router.get("/logout", function (req, res) {
  req.logout();
  req.flash("success", "See you soon :)");
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
