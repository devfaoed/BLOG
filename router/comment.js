const mongoose = require("mongoose");
const express = require("express");
const routes = express.Router();
const Blog = require("../model/blog");
const Comment = require("../model/comment");
const blogRouter = require("./blog");


// routes to add comments to post
routes.post("/blog/:id/show", isLoggedIn,  function(req, res){
     Blog.findById(req.params.id, function(err, foundblog){
        if(err){
            console.log(err);
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username;
                    comment.save();
                    foundblog.comments.push(comment);
                    foundblog.save();
                    console.log(req.body.comment);
                    res.redirect("/blog/" + foundblog._id + "/show");
                }
            })
        }
    })
})


// routes to edit campground comment
routes.get("/blog/:id/show/:comment_id/edit", ownComment, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundcomment){
        if(err){
            console.log(err);
        }
        else{
            res.render("comment_edit", {campground_id:req.params.id, foundcomment:foundcomment});
        }
    })
})


// routes to update campground comment
routes.put("/blog/:id/show/:comment_id", isLoggedIn, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err){
        if(err){
            console.log(err);
            res.redirect("back"); 
        }
        else{
            console.log(req.params.comment_id);
            console.log("updated successfully");
            res.redirect("/blog/" + req.params.id  +"/show");
        }
    })
})

// routes to delete campground comment
routes.delete("/blog/:id/show/:comment_id", ownComment,function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        }
        else{
            console.log("comment deleted successfully");
            res.redirect("back");
        }
    })
})


function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    else{
        res.redirect("/login");
    }
}


function ownComment(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundcomment){
            if(err){
               res.redirect("back");
            }
            else{
                if(foundcomment.author.id.equals(req.user.id)){
                    next();
                }else{
                    res.redirect("back"); 
                }
            }
        });
    }
    else{
        res.redirect("back");
    }   
}
module.exports = routes