var express        = require("express"),
    bodyParser     = require("body-parser"),
    methodOverride = require("method-override"),
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    mongoose       = require("mongoose"),
    User           = require("./models/user"),
    flash          = require("connect-flash"),
    Campground     = require("./models/campground"),
    Comment        = require("./models/comment"),
    app            = express();

var campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comments");
    
var url = process.env.DATABASEURL || "mongodb://localhost/Golive";

//seedDB();
mongoose.connect(url);

app.locals.moment = require('moment');

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
  secret: "Mohamed Salah is the best player in the world!!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(function(req, res, next) {
  res.locals.current_path = req.path;
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(3000, function() {
  console.log("server is on....");
});
