import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    _id : {
        type : Schema.Types.ObjectId
    },
    password: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String
    },
    type : {
        type : String
    },
    picture: {
        type: String
    },
    points : {
        type: Number
    },
    status : {
        type : String // 2 dissaproved user
    }
    
},{ versionKey: false })

module.exports = mongoose.model('User', User, 'user');