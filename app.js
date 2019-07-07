let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    User = require("./models/user"),
    seedDB = require('./seeds')

//requiring routes from separate files
let commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index")



seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")
app.use(express.static(__dirname+ "/public"))
app.use(methodOverride("_method"));


//passport configuration
app.use(require("express-session")({
    secret:"Kobe is the best!",
    resave:false,
    saveUninitialized:false
}))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(campgroundRoutes);



app.listen(3000, () => {
    console.log("Welcome to Camp!");


})