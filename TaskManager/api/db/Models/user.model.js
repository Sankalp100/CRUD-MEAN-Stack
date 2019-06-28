const mongoose = require('mongoose');
const _ = require("lodesh");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require('bcryptjs');

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
                resolve(token);
            }else {
                reject();
            }
        })
    })
}

UserSchema.methods.generateRefreshAuthToken = function(){
    return new Promish((resolve, reject) => {
        crypto.randomBytes(64, (err, buf) => {
            if (!err){
                let token = buf.toString("hex");

                return resolve(token);
            }
        })
    })
}

UserSchema.methods.createSession = function() {
    let user = this;

    return user.generateRefreshAuthToken().then((refreshToken)=> {
        return saveSessionToDatabase(user, refreshToken);
    }).then((refreshToken) => {
        return refreshToken;
    }).catch((e)=>{
        return Promise.reject('failed to save session to database. \n' + e);
    });
}

UserSchema.static.findByIdAndToken = function(_id, token) {
    const user = this;

    return User.findOne({
        _id,
        'session.token': token
    });
}

UserSchema.statics.findByCredentials = function(email, password){
    let User = this;
}


// Middleware

UserSchema.pre('save', function (next) {
    let user = this;
    let costFactor = 10;

    if(user.isModified('password')){
        bcrypt.genSalt(costFactor, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        })
    }
});



/* Helper methods*/ 
let saveSessionToDatabase = (user, refreshToken) => {
    // Save session to database
    return new Promise((resolve, reject) => {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({ 'token': refreshToken, expireAt});

        user.save().then(() => {
            //Session saved successfully
            return resolve(refreshToken);
        }).catch((e) => {
            reject(e);
        });
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    return ((Date.now() / 1000) + secondsUntilExpire);
}
 