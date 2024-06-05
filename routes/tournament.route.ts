import express from 'express'
import { UserController } from '../controllers/user.controller'
import { TournamentComponent } from '../controllers/tournament.controller'
const fs = require('fs')
let mongoosee = require('mongoose')
const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null, '../frontend/app/src/assets/') 
    },
    filename : function(req,file,cb){
        if(file && file['fieldname'] === 'profilePicture')
        {
            //console.log(file);
            let extension = "." + file.originalname.split(".")[1]
            let id = mongoosee.Types.ObjectId()
            req.body.picture = 'profile_' + id + extension
            req.body._id = id
            cb(null,req.body.picture)
        }
        
           
    }, 

})
const upload = multer({storage: storage})
const tournamenRouter = express.Router()

tournamenRouter.route('/getTournamentReservations').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().getTournamentReservations(req,res)
})

tournamenRouter.route('/getAllTournaments').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().getAllTournaments(req,res)
})
tournamenRouter.route('/getAllActiveTournaments').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().getAllActiveTournaments(req,res)
})

tournamenRouter.route('/createNewTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().createNewTournament(req,res)
})

tournamenRouter.route('/editTournamentMatch').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().editTournamentMatch(req,res)
})
tournamenRouter.route('/createTournamentMatch').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().createTournamentMatch(req,res)
})
tournamenRouter.route('/deleteTournamentMatch').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().deleteTournamentMatch(req,res)
})
tournamenRouter.route('/getTournamentByName').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().getTournamentByName(req,res)
})

tournamenRouter.route('/activateTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().activateTournament(req,res)
})

tournamenRouter.route('/deleteTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().deleteTournament(req,res)
})
tournamenRouter.route('/registerForTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().registerForTournament(req,res)
})
tournamenRouter.route('/registeredPlayers').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().registeredPlayers(req,res)
})
tournamenRouter.route('/playersRegistrations').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().playersRegistrations(req,res)
})

tournamenRouter.route('/registeredPerTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().registeredPerTournament(req,res)
})
tournamenRouter.route('/getAllRegTournaments').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().getAllRegTournaments(req,res)
})
tournamenRouter.route('/unregisterFromTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().unregisterFromTournament(req,res)
})
tournamenRouter.route('/finishTournament').post(upload.single(), (req:express.Request, res:express.Response) => {
    new TournamentComponent().finishTournament(req,res)
})

module.exports = tournamenRouter