const mongoose = require('mongoose');
const {commentSchema} = require("./commentModel");

// Define the Post schema
const postSchema = new mongoose.Schema({
    // MongoDB will automatically create a unique ID for each post
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    avatarImage: {
        type: String,
        default: "",
    },
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    likedby: [{
        type: mongoose.Schema.Types.ObjectId,
    }],
    comments: [commentSchema],
    tags: [{
        type: String
    }],
    reported: {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    }
    
});

// Create the Post model
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
