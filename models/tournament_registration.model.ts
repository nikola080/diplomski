import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TournamentRegistration= new Schema({
    _id : {
        type : Schema.Types.ObjectId
    },
    tournament : {
        type : Schema.Types.ObjectId
    },
    player : {
        type : String
    },
    status : {
        type : String // 1 - created, 2 - playing, 3 - finished, 4 - retired, 5 - seed
    }
    },{ versionKey: false }
)


module.exports = mongoose.model('TournamentRegistration', TournamentRegistration, 'tournament_registration');