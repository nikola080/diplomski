import express from 'express'
import { Admin } from 'mongodb'
import mongoose, { mongo } from 'mongoose'
import { json } from 'stream/consumers'
import { resourceLimits } from 'worker_threads'
const fs = require('fs')
let mongoosee = require('mongoose')

const User = require('../models/user.model')

export class UserController{

    
    singIn = ( req:express.Request, res:express.Response) => {
        let email = req.body.email;
        let password = req.body.password;
        //console.log(email + " " + password)
        User.findOne({
            $and : [
                {'email' : {$eq : email}},
                {'password' : {$eq : password}},
                {'status' : {$eq : '1'}}
            ]
        }, (err, user) => {
            if(err){
                //console.log({'message' : '-1'});
            } 
            else{
                if(user){
                    
                    let retUser = {
                        'firstName' : user['firstName'],
                        'lastName' : user['lastName'],
                        'email' : user['email'],
                        'phone' : user['phone'],
                        'type' : user['type'],
                        'picture' : user['picture']
                    }
                    res.json({
                        'message' : '1',
                        'user' : retUser
                    });
                } 

                else res.json({'message' : '0'});

            }
        });
    }

    checkEmailUnique = ( req:express.Request, res:express.Response) => {
        let email = req.body.email
        
        User.findOne({
            
            'email' : email
            
              
        },  (err, user) =>{
            if(err) {
                res.json({'message' : '-1'})
            }
            else{
                if(user) res.json({'message' : '0'})
                
                else res.json({'message' : '1'})
                
            }
        });
    }

    attemptSignUp = ( req:express.Request, res:express.Response ) => {

        User.collection.insertOne({
            '_id' : mongoosee.Types.ObjectId(req.body._id),
            'firstName' : req.body.firstName,
            'lastName' : req.body.lastName,
            'email' : req.body.email,
            'password' : req.body.password,
            'phone' : req.body.phone,
            'type' : req.body.type,
            'picture' : typeof req.body.picture !== 'undefined' ? req.body.picture : '',
            'status' : '0',
            'points' : '0'
        }, (err, user) => {
            if(err) {
                res.json({'message' : '-1'})    
            }
            else{

                if(user){
                    res.json({'message' : '1'});
                }
                else{
                    res.json({'message' : '0'});
                }

            }
        });
    }

    approveUser = ( req:express.Request, res:express.Response ) => {
        let approveWho = req.body.email
        User.collection.updateOne(
            {
                'email' : {$eq : approveWho}
            },
            {
                $set : {'status' :  '1'}
            }, (err, user) => {
                
                if(err) {
                    res.json({'message' : '-1'})    
                }
                else{

                    if(user){
                        
                        res.json({'message' : '1'});
                    }
                    else{
                        res.json({'message' : '0'});
                    }

                }
            }
        );

    }

    deleteUser = ( req:express.Request, res:express.Response ) => {
        let approveWho = req.body.email
        User.collection.deleteOne(
            {
                'email' : {$eq : approveWho}
            },
            (err, user) => {
                
                if(err) {
                    res.json({'message' : '-1'})    
                }
                else{

                    if(user){
                        
                        res.json({'message' : '1'});
                    }
                    else{
                        res.json({'message' : '0'});
                    }

                }
            }
        );

    }

    changePassword = (req:express.Request, res:express.Response) => {
        let email = req.body.email;
        let newPassword = req.body.newPassword;

        User.collection.updateOne(
            {
                'email' : {$eq : email}
            },
            {
                $set : {'password' : newPassword}
            },
            (err, user) => {
                if(err) {
                    res.json({'message' : '-1'})    
                }
                else{

                    if(user){
                        res.json({'message' : '1'});
                    }
                    else{
                        res.json({'message' : '0'});
                    }

                }
            }
        )
    }

    changeUserInputs = async ( req:express.Request, res:express.Response ) => {
        let which = req.body.which
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let phone = req.body.phone;
        let email = req.body.newEmail;
        let picture = req.body.picture;
        if(typeof picture === 'undefined')
            picture = '';

        //console.log(firstName + " " + lastName + " " + phone + " " + email + " " + picture + " " + which);
       
        let emailFound = false;
        if(email !== ''){
            await User.findOne({
                'email' : email     
            }, (err,user) => {
                if(!err && user){
                    emailFound = true;
                }
            }).clone();
        }

        if(!emailFound)
            User.findOne(
                {'email' : which},
                async (err, user) =>  {
                    if(!err && user){
                    
                        if(firstName !== ''){
                            await User.collection.updateOne(
                                {'email' : which},
                                {
                                    $set : {
                                        'firstName' : firstName
                                    }
                                }
                            )
                        }
                        if(lastName !== ''){
                            await User.collection.updateOne(
                                {'email' : which},
                                {
                                    $set : {
                                        'lastName' : lastName
                                    }
                                }
                            )
                        }
                        if(phone !== ''){
                            await User.collection.updateOne(
                                {'email' : which},
                                {
                                    $set : {
                                        'phone' : phone
                                    }
                                }
                            )
                        }
                        
                        if(picture !== ''){
                            await User.findOne({
                                'email' : which
                            }, async (err, user) => {
                                if(user && user['picture'] != ''){
                                    await fs.unlinkSync('../frontend/app/src/assets/' + user['picture'])
                                
                                }
                            }).clone();

                            await User.collection.updateOne(
                                {'email' : which},
                                {
                                    $set : {
                                        'picture' : picture
                                    }
                                }
                            );
                        }

                        if(!emailFound && email !== ''){
                            await User.collection.updateOne(
                                {'email' : which},
                                {
                                    $set : {
                                        'email' : email
                                    }
                                }
                            )
                        }
                        else{
                            //console.log(email)
                        }
                        
                    }
                }
            );

        if(emailFound){
            res.json({'message' : '0'});
        }
        else{
            if(picture === '')
                res.json({'message' : '1'});
            else
                res.json({'message' : '1' , 'picture' : picture});
        }

    }

    findUser = ( req:express.Request, res:express.Response ) => {
        let email = req.body.email

        User.findOne({
            'email' : {$eq : email}
        }, (err, user) => {
            if(err){
                res.json({'message' : '-1'})
            }
            else{
                if(!user)
                    res.json({'message' : '0'})
                else{
                    res.json({'message' : '1', 'user' : user})
                }
            }
        })
    }

    getAllUsers = ( req:express.Request, res:express.Response ) => {
        let usersType = [
            'Academy player',
            'Recreational player'
        ]
        User.find(
                {
                    'status' : '1',
                    'type' : {
                        $in : usersType
                    }
                }, (err, users) => {
            if(users){
                res.json({"message" : "1", "users" : users})
            }

            else{
                res.json({"message" : "0"})
            }
        })

    }

    getAllUsersToApprove = (req:express.Request, res:express.Response) => {
        User.find(
            {
               'status' : {$eq : '0'} 
            },
            (err, users) => {
                if(!err && users){
                    res.json({
                        'message' : '1',
                        'users' : users
                    })
                }
            }
        )
    }

    getAllApprovedUsers = (req:express.Request, res:express.Response) => {
        User.find(
            {
               'status' : {$eq : '1'} 
            },
            (err, users) => {
                if(!err && users){
                    res.json({
                        'message' : '1',
                        'users' : users
                    })
                }
            }
        )
    }
    

    findPlayer  = (req:express.Request, res:express.Response) => {
        User.findOne(
            { 
                "email": 
                    { $regex: '.*' + req.body.player + '.*' },
                "type" : {$ne : 'Admin'}
            },
            (err, player) => {
                if(!err  && player){
                    res.json({'message' : '1', 'player' : player})
                }
            })
    }

    dissaproveUser = (req:express.Request, res:express.Response) => {

        User.collection.updateOne(
            {
                '_id' : req.body.id
            },
            {
                'status' : '2'
            },
            (err, user) => {
                if(!err && user)
                {
                    res.json({'messagge' : '1'})
                }
                else
                {
                    res.json({'messagge' : '0'})
                }
            }
        )

    }

    getAcademyPlayers = (req:express.Request, res:express.Response) => {

        User.find(
            {
                $and : [
                    { 'type' : 'Academy player'},
                    { 'status' : '1'}
                ]
               
                
            },
            (err, players) => {
                if(!err && players)
                {
                    res.json({'message' : '1','players' : players})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )
        
    }

    resetPoints = async (req:express.Request, res:express.Response) =>{
        User.find(
            {
                'status' : '1',
                $or : [
                    {'type' : 'Academy player'},
                    {'type' : 'Recreational player'}
                ]
            },
            async (err, players) =>{

                if(players)
                {
                    players.sort( (elem1, elem2) =>{
                        return elem2 - elem1;
                    })
                }

                let give = 15;

                for(let i = 0; i < players.length; i++)
                {
                    if(i < 15)
                        await User.collection.updateOne(
                            {
                                'email' : players[i].email
                            }
                            ,
                            {
                                $set : {
                                    'points' : give--
                                }
                            }
                        )
                    else
                        await User.collection.updateOne(
                            {
                                'email' : players[i].email
                            }
                            ,
                            {
                                $set : {
                                    'points' : 0
                                }
                            }
                        )
                }

            }
        )
    }

}
 

   