const { addPost } = require("../controllers/postsController");
const { getPost } = require("../controllers/postsController");
const { upvote } = require("../controllers/postsController");
const { addComment } = require("../controllers/postsController");
const { getComments } = require("../controllers/postsController");
const { report } = require("../controllers/postsController");
const { userPost } = require("../controllers/postsController");
const { updatePostsAvatar } = require("../controllers/postsController");

const router = require("express").Router();
//The Router class is used to create modular, mountable route handlers.
router.post("/addPost/:id",addPost);
router.get("/getPost",getPost);
router.post('/upvote',upvote);
router.post('/addComment',addComment);
router.get('/:id/comments',getComments);
router.post('/report', report);
router.get("/userPost/:id", userPost);
router.post("/updatePostsAvatar/:id", updatePostsAvatar);



module.exports = router; 