const mongoose = require ("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 50,
    },
    password: {
        type: String,
        required: true,
        min: 8,
    },
    gender: {
        type: String,
        enum: ['male', 'female'], // Assuming only two options for gender
    },
    age: {
        type: Number,
        min: 3,
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },
    avatarImage: {
        type: String,
        default: "",
    },
    contacts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users' // Reference to the same collection
    }],
    default:[],
});

module.exports = mongoose.model("Users", userSchema);

//A model of name "users"  is made inside the chat DB.
 


