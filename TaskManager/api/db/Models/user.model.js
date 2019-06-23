const mongoose = require('mongoose');
const _ = require("lodesh");
const jwt = require("jsonwebtoken");

// JWT Secret 
const jwtSecret = "51778657246321226641fsdklafjasdkljfsklfjd7148924065";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token: {
            type: String,
            required: true
        },
        expireAt: {
            type: Number,
            required: true
        }
    }]
});

// Instance methods

UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.omit(userObject, ['password','session']);
}

UserSchema.methods.generateAccessAuthToken = function(){
    const user = this;
    return new Promise((resolve, reject) => {
        // Create the JSON web Token and return that
        jwt.sign({_id: user._id.toHexString() }, jwtSecret, { expiresIn: "15m"}, (err, token) => {
            if(!err) {
                
            }
        })
    })
}