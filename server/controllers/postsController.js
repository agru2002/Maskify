const { model } = require("mongoose");
const Post = require("../model/postModel");
const {Comment }= require("../model/commentModel");
const Users = require("../model/userModel");

module.exports.addPost = async (req,res,next) => {
    try{
        const userId = req.params.id;
        const {content, avatarImage, username} = req.body;
        const post = await Post.create({
            content,
            userId,
            avatarImage,
            username,
        });
        res.status(200).json({ success: true, message: 'Post created successfully' });
    } catch (ex) {
        next (ex);
    }
};

module.exports.getPost = async (req,res,next) => {
    try{
        const posts = await Post.find().sort({timestamp: -1});
        res.status(200).json(posts);
    } catch(err){
        next(err);
    }
}

module.exports.upvote = async (req, res, next) => {
    const { postId, likedBy } = req.body;

    try {
        // Check if the user has already liked the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        const likedIndex = post.likedby.findIndex(like => like.equals(likedBy));

        if (likedIndex === -1) {
            // If the user hasn't liked the post, add the like
            post.likedby.push(likedBy);
            post.likes++;
            await post.save();
            res.status(200).json({ message: "Post liked successfully", flag:1 });
        } else {
            // If the user has already liked the post, remove the like
            post.likedby.splice(likedIndex, 1);
            post.likes--;
            await post.save();
            res.status(200).json({ message: "Post unliked successfully", flag: 0 });
        }
    } catch (error) {
        console.error("Error handling post like:", error);
        res.status(500).json({ error: "Server error" });
    }
}

module.exports.addComment = async(req,res,next) => {
    try{
        const {postId, commentInput, user} = req.body;
        
        const comment = await Comment.create({
            text:commentInput,
            user:user,
            post: postId,
        });

      

        await comment.populate('user', 'username avatarImage');

        await Post.findByIdAndUpdate(postId, {$push: {comments: comment._id}});

        res.status(201).json({success:true, comment:comment});

    } catch (error) {
        next(error);
    }
}

module.exports.getComments = async(req,res,next) => {
    try{
        const postId = req.params.id;
        const comments = await Comment.find({post: postId})
                                        .populate('user', 'username avatarImage')
                                        .sort({timestamp :-1});
        res.status(200).json(comments);
    } catch (err) {
        next(error);
    }
}

module.exports.report = async(req,res,next) => {
    try{
        const {userId, postId} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.reported.push(userId);
        await post.save();
        res.status(200).json({message : 'Post Reported Successfully'});
    } catch (err) {
        console.log(err);
    }   
} 

module.exports.userPost = async(req,res,next) => {
    try{
        const userId = req.params.id;
        const posts = await Post.find({userId}).sort({ timestamp: -1 });
        res.status(200).json(posts);
    } catch (err) {
        next(err);
    };
}

module.exports.updatePostsAvatar = async(req,res,next) => {
    try {
        const userId = req.params.id;
        const {  image } = req.body;
        const updateResult = await Post.updateMany({ userId }, { $set: { avatarImage: image } });
        res.status(200).json({ updatedCount: updateResult.nModified });
    } catch (error) {
        console.error("Error updating posts avatar:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}