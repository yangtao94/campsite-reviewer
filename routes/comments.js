let express = require("express");
let router = express.Router({ mergeParams: true });

let Campground = require("../models/campground")
let Comment = require("../models/comment")
let middleware = require("../middleware");
//comments new

router.get("/new", middleware.isLoggedIn, (req, res) => {
    //Comment form
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            
        }
        else {
            res.render("comments/new", { campground: campground });
        }
    })

})
//comments create

router.post("/", middleware.isLoggedIn, (req, res) => {
    console.log("IM in dude");
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            req.flash("error","Something went wrong");
            redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                }
                else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success","Successfully added comment!");
                    res.redirect('/campgrounds/' + campground._id);
                }
            })
        }
    })



})


//EDITING COMMENTS
router.get("/:comment_id/edit",middleware.checkCommentOwnership, (req, res) => {

    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render("comments/edit", {
                campground_id: req.params.id,
                comment: foundComment
            })
        }
    });
});

//Updating Comments
router.put("/:comment_id",middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, foundComment) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        }
        else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});
//Destroy Comment
router.delete("/:comment_id",middleware.checkCommentOwnership,(req,res)=>{
        Comment.findByIdAndRemove(req.params.comment_id,(err,comment)=>{
            if(err) {
                console.log(err);
                res.redirect("back");
            }
            else {
                res.redirect("/campgrounds/"+req.params.id);
            }
        })



});



module.exports = router;