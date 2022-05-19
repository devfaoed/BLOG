const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    title: String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;