const mongoose = require('mongoose');
const Users = require ("./userModel");
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Users',
        
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }


});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = {
    commentSchema: commentSchema,
    Comment: Comment
};
