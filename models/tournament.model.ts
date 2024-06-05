import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Tournament = new Schema({
    _id : {
        type : Schema.Types.ObjectId
    },
    name : {
        type : String
    },
    starts : {
        type : String
    },
    ends : {
        type : String
    },
    prize : {
        type : String
    },
    capacity : {
        type : String
    },
    status : {   // 0-created, 1-active, 2-finished
        type : String
    }
},{ versionKey: false })

module.exports = mongoose.model('Tournament', Tournament, 'tournament');