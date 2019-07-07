let express = require("express");
let router = express.Router();
let passport = require('passport');
let User = require("../models/user");
let middleware = require("../middleware");
//landing page
router.get("/", (req,res)=> {
    // res.send("this will be landing page soon!")
    res.render("landing");
})





//Auth routes

//show register form
router.get("/register",(req,res)=>{
    res.render("register");
})

//post register
router.post("/register",(req,res)=> {
    
    let newUser = new User({
        username: req.body.username
    });

    User.register(newUser, req.body.password, (err,user)=>{
        if (err) {
            req.flash("error",err.message);
            return res.render("/register")
        }
        else {
            passport.authenticate("local")(req,res,()=>{
                req.flash("success","Welcome, "+user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});



//show login form

router.get("/login", (req,res)=> {
    res.render("login");
});

router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login",
    successFlash: "Welcome back!"
}), (req,res)=> { 
});

//logout

router.get("/logout",(req,res)=>{
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
})



module.exports = router;