const { register, getUserProfile } = require("../controllers/usersController");
const { login } = require("../controllers/usersController");
const { setAvatar} = require("../controllers/usersController");
const { getAllUsers } =require("../controllers/usersController");
const { addContact } = require("../controllers/usersController");


const router = require("express").Router();
//The Router class is used to create modular, mountable route handlers.
router.post("/register",register);
router.post("/login",login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id", getAllUsers);
router.post("/addContact/:id", addContact);
router.get("/getUserProfile/:id", getUserProfile);



module.exports = router; 