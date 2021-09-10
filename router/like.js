const mongoose = require("mongoose");
const express = require("express");
const routes = express.Router();
const Blog = require("../model/blog");
const Like = require("../model/like");



// routes to add comments to post
routes.post("/blog/:id/like", isLoggedIn,  function(req, res){
     Blog.findById(req.params.id, function(err, foundblog){
        if(err){
            console.log(err);
        }
        else{
            Like.create(req.body.like, function(err, like){
                if(err){
                    console.log(err);
                }
                else{
                    like.author.id = req.user._id
                    like.author.username = req.user.username;
                    like.save();
                    foundblog.likes.push(like);
                    foundblog.save();
                    console.log(req.body.like);
                    res.redirect("back");
                }
            })
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

module.exports = routes