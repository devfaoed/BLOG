const express = require("express");
const app = express();

const passport = require("passport");
const LocalStrategy = require("passport-local");
const multer = require("multer") 
const ejs = require("ejs");
const methodOverride = require("method-override");



// models for the article
const Blog = require("./model/blog");
const Comment = require("./model/comment");
const Like = require("./model/like");
const User = require("./model/user");

// router for the article
const blogRouter = require("./router/blog");
const commentRouter = require("./router/comment");
const likeRouter = require("./router/like");
const userRouter = require("./router/user");


const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const { serializeUser } = require("passport");
mongoose.connect("mongodb://localhost/blog", {useNewUrlParser: true, useUnifiedTopology: true});

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));


// configuring passport
app.use(require("express-session")({
    secret: "building an article blog app",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use( new LocalStrategy(User.authenticate()));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

app.set("view engine", "ejs");


app.use(blogRouter);
app.use(commentRouter);
app.use(likeRouter);
app.use(userRouter)


app.listen(2020, function(){
    console.log("Blog server started successfully on port 2020");
})