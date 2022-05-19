const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    react: "",
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
const Like = mongoose.model("Like", likeSchema);

module.exports = Like;