import express from 'express'
import { UserController } from '../controllers/user.controller'
import { ReservationController } from '../controllers/reservation.controller'
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
const reservationRouter = express.Router()

reservationRouter.route('/searchFreePeriod').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().searchFreePeriod(req,res)
})

reservationRouter.route('/insertReservationNT').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().insertReservationNT(req,res)
})

reservationRouter.route('/cancelReservation').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().cancelReservation(req,res)
})

reservationRouter.route('/terminateReservation').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().terminateReservation(req,res)
})

//get all reservations that are not terminated or are a tournament reservations
reservationRouter.route('/getAllReservations').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().getAllReservations(req,res)
})

reservationRouter.route('/getMyReservations').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().getMyReservations(req,res)
})
reservationRouter.route('/makePractise').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().makePractise(req,res)
})
reservationRouter.route('/myPractises').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().myPractises(req,res)
})
reservationRouter.route('/batchReservationDelete').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().batchReservationDelete(req,res)
})
reservationRouter.route('/editReservation').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().editReservation(req,res)
})
reservationRouter.route('/getCoachesPractises').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().getCoachesPractises(req,res)
})
reservationRouter.route('/coachDiary').post(upload.single(), (req:express.Request, res:express.Response) => {
    new ReservationController().coachDiary(req,res)
})

module.exports = reservationRouter