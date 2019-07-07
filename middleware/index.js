//all middleware goes here
let Campground = require("../models/campground");
let Comment = require("../models/comment");

let middlewareObj = {};



middlewareObj.checkCampgroundOwnership = function (req,res,next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, (err,foundCampground)=>{
            if (err) {
                req.flash("error","Campground cannot be found");
                res.redirect("back");
            }
            else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You don't have the necessary permissions");
                    res.redirect("back");
                }
            }
        })
    }else {
        req.flash("error","You need to be logged in to do that!");
        res.redirect("back");

    }

}

middlewareObj.checkCommentOwnership =  function checkCampgroundOwnership(req,res,next) {
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err,foundComment)=>{
            if (err) {
                res.redirect("back");
            }
            else {
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error","You dont have the necessary permissions");
                    res.redirect("back");
                }
            }
        })
    }else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");

    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }

}




module.exports = middlewareObj