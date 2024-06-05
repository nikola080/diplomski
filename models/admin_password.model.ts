import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AdminPassword = new Schema({
    _id : {
        type : Schema.Types.ObjectId
    },
    password : {
        type : String
    },
    days : {
        type : Number
    }
    
},{ versionKey: false })

module.exports = mongoose.model('AdminPassword', AdminPassword, 'admin_password');