import mongoose from "mongoose";

const Schema = mongoose.Schema;

const TournamentMatch = new Schema({
    _id : {
        type : Schema.Types.ObjectId
    },
    reservation : {
        type : Schema.Types.ObjectId
    },
    player1 : {
        type : String
    },
    player2 : {
        type : String
    },
    result : {
        type : String
    },
    tournament : {
        type :  Schema.Types.ObjectId
    },
    index : {
        type : String
    },
    status : {
        type : String // 1 - created, 2 - playing, 3 - finished, 4 - retired, 5 - seed
    }
    },{ versionKey: false }
)


module.exports = mongoose.model('TournamentMatch', TournamentMatch, 'tournament_match');