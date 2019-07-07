let express = require("express");
let router = express.Router();

let Campground = require("../models/campground");
let middleware = require("../middleware");

router.get("/campgrounds",(req,res)=> {
    //get campgrounds from DB
    Campground.find({},(err,campgrounds)=> {
        res.render("campgrounds/index",{campgrounds:campgrounds});
    })
    
})

//creating post request / submit form

router.get("/campgrounds/new",middleware.isLoggedIn,(req,res)=>{
    res.render("campgrounds/new");
})





router.post("/campgrounds",middleware.isLoggedIn,(req,res)=>{
    let name = req.body.name;
    let image = req.body.image;
    let description = req.body.description;
    let price = req.body.price;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    Campground.create({
        name: name,
        image: image,
        description: description,
        price:price,
        author:author
    }, (err,newCreated)=> {
        console.log("new addition");
    })
    res.redirect("/campgrounds");
})



router.get("/campgrounds/:id",(req,res) => {
    //find campground with provided ID
    //render the show TEMPLATE with the particular ID
    
    Campground.findById(req.params.id).populate("comments").exec((err,foundCampground) =>{
        if (err) console.log(err);
        else {
            res.render("campgrounds/show",{campground:foundCampground});
        }
    })
    
    
})

//Edit campground route
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership,(req,res)=>{
    Campground.findById(req.params.id,(err,foundCampground)=>{
        res.render("campgrounds/edit", {campground: foundCampground});
    })



   
    
})

//Update Campground route
router.put("/campgrounds/:id/",middleware.checkCampgroundOwnership,(req,res)=> {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground,(err,campground)=>{
        if (err) {
            res.redirect("/campgrounds");

        }
        else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


//Destroy Campground route

router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership,(req,res)=>{
    //remove
    Campground.findByIdAndDelete(req.params.id,(err)=>{
        if(err) {
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    })
})



function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()) {
        return next();
    }
    else res.redirect("/login");


}




module.exports = router;