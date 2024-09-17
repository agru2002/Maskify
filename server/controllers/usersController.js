// A controller is a JavaScript file responsible for handling incoming HTTP requests and generating appropriate HTTP responses.
const { model } = require("mongoose");
const User = require ("../model/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req,res,next) => {
    try{
        const {username , email , password, gender,age } = req.body;
        const usernameCheck = await User.findOne({ username });
        if(usernameCheck){
            return res.json({msg: "Username already used", status: false});
        }
        const emailCheck = await  User.findOne({ email });
        if(emailCheck){
            return res.json({msg: "Email already used", status: false});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            gender,
            age
        });
        delete user.password;
        return res.json({status: true, user});
    } catch (ex){
        next(ex);
    }
};

module.exports.login = async (req,res,next) => {
    try{
        const {username ,password } = req.body;
        let user ;
        user = await User.findOne({
            $or: [{ username: username }, { email: username }]
        });
        if(!user){
            return res.json({msg: "Incorrect username or password", status: false});
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.json({msg: "Incorrect username or password", status: false});
        }
        // delete user.password;
        const user_ = { ...user.toObject() };
        delete user_.password;
        delete user_.gender;
        delete user_.contacts;
        return res.json({status: true, user_});
    } catch (ex){
        next(ex);
    }
};
 
module.exports.setAvatar = async (req,res,next) => {
    try{
        const userId = req.params.id;
        const avatarImage = req.body.image;
        console.log('before',req.body);
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage,
        },{ new: true });

        return res.json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });
    } catch(ex) {
        next (ex);
    }
};

module.exports.getAllUsers = async(req,res,next) =>{
    try{
        const userId = req.params.id;
        const   user = await User.findById(userId).populate('contacts', '_id username avatarImage');

        const contacts = user.contacts.map(contact => ({
            _id : contact._id,
            username : contact.username,
            avatarImage : contact.avatarImage,
        }))
        contacts.reverse();
        return res.json(contacts);
    } catch (ex){
        next(ex);
    }

};

module.exports.addContact = async(req,res,next) => {
    try{
        const userId = req.params.id;
        const newContact = req.body.contact;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        if (user.contacts.includes(newContact)) {
          
            return res.status(200).json({ flag:1});
        }



        user.contacts.push(newContact);
        await user.save();
        return res.status(200).json({flag: 0});

    } catch (ex) {
        next(ex);
    }
}

module.exports.getUserProfile = async(req,res,next) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        if(user){
            const contactCount = user.contacts.length;
            return res.status(200).json({username: user.username, avatarImage: user.avatarImage, contactCount: contactCount });
        }
    } catch (err) {
        next (err);
    }
}