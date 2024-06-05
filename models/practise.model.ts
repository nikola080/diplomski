import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Practice = new Schema({
    _id : {
        type : Schema.Types.ObjectId
    },
    reservation : {
        type : Schema.Types.ObjectId
    },
    participants : {
        type : [String]
    },
    summary : {
        type : String
    }
    },{ versionKey: false }
)


module.exports = mongoose.model('Practice', Practice, 'practice');