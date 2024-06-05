import express from 'express'
import { UserController } from '../controllers/user.controller'
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
const guestRouter = express.Router()

guestRouter.route('/checkEmailUnique').post(upload.single(), (req:express.Request, res:express.Response) => {

    new UserController().checkEmailUnique(req,res)

})

guestRouter.route('/singIn').post(upload.single(), (req, res, next) => {
    
    new UserController().singIn(req,res)
})

guestRouter.route('/attemptSignUp').post(upload.single('profilePicture'), (req:express.Request, res:express.Response) => {
    
    new UserController().attemptSignUp(req,res)
})

guestRouter.route('/changePassword').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().changePassword(req,res)
})

guestRouter.route('/changeUserInputs').post(upload.single('profilePicture'), (req:express.Request, res:express.Response) => {
    new UserController().changeUserInputs(req,res)
})

guestRouter.route('/findUser').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().findUser(req,res)
})

guestRouter.route('/getAllUsers').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().getAllUsers(req,res)
})
guestRouter.route('/getAllUsersToApprove').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().getAllUsersToApprove(req,res)
})

guestRouter.route('/approveUser').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().approveUser(req,res)
})

guestRouter.route('/getAllApprovedUsers').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().getAllApprovedUsers(req,res)
})
guestRouter.route('/deleteUser').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().deleteUser(req,res)
})

guestRouter.route('/findPlayer').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().findPlayer(req,res)
})

guestRouter.route('/dissaproveUser').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().dissaproveUser(req,res)
})
guestRouter.route('/getAcademyPlayers').post(upload.single(), (req:express.Request, res:express.Response) => {
    new UserController().getAcademyPlayers(req,res)
})



module.exports = guestRouter