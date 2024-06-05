import { match } from 'assert'
import { Console } from 'console'
import express from 'express'
import { stat } from 'fs'
import { Admin } from 'mongodb'
import mongoose, { Schema, mongo } from 'mongoose'
import { json } from 'stream/consumers'
import { resourceLimits } from 'worker_threads'
const fs = require('fs')
let mongoosee = require('mongoose')

const Reservation = require('../models/reservation.model');
const User = require('../models/user.model');
const TournamentMatch = require('../models/tournament_match.model');
const Tournament = require('../models/tournament.model');

const { ObjectId } = require('mongodb');

export class ReservationController{

    searchFreePeriod = ((req:express.Request, res:express.Response) =>{
        let court = req.body.court;
        let date = req.body.date;
        Reservation.find({
            $and : [
                {
                    'court' : court //(court === '') ? {$ne : ''} : {$eq : court}
                },
                {
                    'date' : date //(date === '') ? {$ne : ''} : {$eq : date}
                }

            ]
        }).exec(
            (err, reservations) => {
                if(err){
                    
                    res.json({'message' : '-1'});
                }
                else{
                    if(reservations){
                        
                        res.json({'message' : '1', 'foundReservations' : reservations})
                    }
                    else{
                     
                        res.json({'message' : '0'})
                    }
                }
        });


    });

    insertReservationNT = async (req:express.Request, res:express.Response) =>{
        let resID : Schema.Types.ObjectId = null;
        let timeStart = req.body.starts
        let timeEnd = req.body.ends

        let firstStart = parseInt(timeStart.split(":")[0]) * 60 + parseInt(timeStart.split(":")[1])
        let firstEnd = parseInt(timeEnd.split(":")[0]) * 60 + parseInt(timeEnd.split(":")[1])
        let flag = false;
        
        await Reservation.find(
            {
                'court' : req.body.court,
                'date' : req.body.date
            },
            (err, resr) =>
            {
                if(!err && resr)
                {
                    
                    let secondStart, secondEnd;
                    for(let i = 0; i < resr.length; i++)
                    {
                        secondStart = parseInt(resr[i].starts.split(":")[0]) * 60 + parseInt(resr[i].starts.split(":")[1])
                        secondEnd = parseInt(resr[i].ends.split(":")[0]) * 60 + parseInt(resr[i].ends.split(":")[1])
    
                       
                        if(
                            (firstStart >= secondStart && firstStart < secondEnd) ||
                            (firstEnd > secondStart && firstEnd <= secondEnd)
                        )
                            {   
                                flag = true;
                                res.json({'message' : '2'}) //someone has already resered
                                break;
                            }
                    }
                   
                }
            }
        ).clone()

        let status;

        let academy_players : string[] = [];

        if(typeof(req.body.academy_players) !== 'undefined')
        {
            academy_players = JSON.parse(req.body.academy_players)
            
        }
        

        if(!flag && typeof req.body.index !== 'undefined')
            status = '2'
        else
            status = '1'
        if(!flag)
            await Reservation.collection.insertOne({
                'reservedByWho' : req.body.reservedByWho,
                'starts' : req.body.starts,
                'ends' : req.body.ends,
                'type' : req.body.type,
                'court' : req.body.court,
                'date' : req.body.date,
                'status' : status,
                'academy_players' : academy_players,
                'description' : ''
            }, (err, reservation) => {
                if(err) {
                    
                    res.json({'message' : '-1'})    
                }
                else{
                    //console.log(reservation)
                    if(reservation){
                        if(typeof req.body.index == 'undefined') res.json({'message' : '1'});
                        
                        resID = reservation.insertedId
                    }
                    else{
                        if(typeof req.body.index == 'undefined') res.json({'message' : '0'});
                    }

                }
            });
        
        
      
        if(!flag && typeof req.body.index !== 'undefined')
        {
            let tourID : Schema.Types.ObjectId
            Tournament.findOne({
                'name' : req.body.tournament
            },
            (err, tournament) => {
                if(!err && tournament)
                {
                    tourID = tournament._id;
                    if(typeof req.body.justres == 'undefined')
                        TournamentMatch.collection.insertOne(
                            {
                                'tournament' : tourID,
                                'player1' : req.body.player1,
                                'player2' : req.body.player2,
                                'index' : req.body.index,
                                'reservation' : resID,
                                'result' : '',
                                'status' : req.body.status
                            },
                            (err, tourMatch) => {
                                if(!err && tourMatch){
                                    //console.log( tourMatch.insertedId )
                                    TournamentMatch.findOne({'_id': tourMatch.insertedId },
                                    (err, matchedMatch) => {
                                        //console.log(matchedMatch)
                                        res.json({'message' : '1' , 'tourMatch' : matchedMatch})
                                    })
                                    
                                }
                                else
                                    res.json({'message' : '0'});
                            }
                        )
                    else
                        TournamentMatch.collection.updateOne(
                            {
                                '_id' : ObjectId(req.body.justres)
                            },
                            {
                                $set : {'reservation' :  resID}
                                
                            },
                            (err, tourMatch) => {
                               
                                if(!err && tourMatch){
                                    //console.log( tourMatch.insertedId )
                                    TournamentMatch.findOne({'_id': tourMatch._id },
                                    (err, matchedMatch) => {
                                        //console.log(matchedMatch)
                                        res.json({'message' : '1' , 'tourMatch' : matchedMatch})
                                    })
                                    
                                }
                                else
                                    res.json({'message' : '0'});
                            }
                        )
                            
                }
            })
        }
        
        
    }

    cancelReservation = (req:express.Request, res:express.Response) => {

        let id = req.body._id

        Reservation.collection.deleteOne(
            {
                '_id' : ObjectId(id),
            },
            (err, deletedRes) => {

                if(!err && deletedRes) {

                    res.json({'message' : '1'})

                }   
                else{

                    res.json({'message' : '0'})

                }

            }
        )

    }

    terminateReservation = (req:express.Request, res:express.Response) => {

        let id = req.body._id

        Reservation.collection.updateOne(
            {
                '_id' : ObjectId(id),
            },
            {
                $set : {
                    'status' : '3'
                }
            },
            (err, updatedRes) => {

                if(!err && updatedRes) {

                    res.json({'message' : '1'})

                }   
                else{

                    res.json({'message' : '0'})

                }

            }
        )

    }

    getAllReservations =  (req:express.Request, res:express.Response) => {

        Reservation.find({
            $and : [
                {'status' : {$ne : '3'}},
                {'status' : {$ne : '2'}}
            ]
            
        },
        (err, reservations) => {
            if(!err && reservations) {
                
                let currDateString = (new Date()).toLocaleDateString('en-GB')
                let arrayCurrDate = currDateString.split('/')
                let currDate = (new Date(parseInt(arrayCurrDate[2]),parseInt(arrayCurrDate[1]) - 1,parseInt(arrayCurrDate[0]))).getTime()
                let currTime = (new Date()).getMinutes() + (new Date()).getHours()*60
                let i = 0;

                while(i != reservations.length)
                {
                    let arrayDate = reservations[i].date.split("/")
                    let date = (new Date(parseInt(arrayDate[2]),parseInt(arrayDate[1]) - 1,parseInt(arrayDate[0]))).getTime()
                    if(currDate > date)
                        reservations.splice(i,1)
                    else
                        i++
                }


                res.json({'message' : '1', 'reservations' : reservations})
            }
            else{
                res.json({'message' : '0'})
            }
        })
    }

    getMyReservations = async (req:express.Request, res:express.Response) => {
        let array_id : mongoose.Types.ObjectId[] = []
        await TournamentMatch.find(
            {'1' : '1'},
            (err, matches) => {
                
                for(let i = 0; i < matches.length; i++)
                {
                    if(matches[i].reservation && (matches[i].player1 == req.body.email || matches[i].player2 == req.body.email)){
                       
                        array_id.push(ObjectId(matches[i].reservation))
                    }
                }
               
                  
            }
        ).clone()

        Reservation.find(
            {
                $or : 
                [
                    {'reservedByWho' : req.body.email},
                    {
                        '_id' : {
                            $in : array_id
                        }
                       
                    }

                ]
                
            },
            (err, reservations) => {
                if(!err && reservations)
                {
                    let currDateString = (new Date()).toLocaleDateString('en-GB')
                    let arrayCurrDate = currDateString.split('/')
                    let currDate = (new Date(parseInt(arrayCurrDate[2]),parseInt(arrayCurrDate[1]) - 1,parseInt(arrayCurrDate[0]))).getTime()
                    let currTime = (new Date()).getMinutes() + (new Date()).getHours()*60
                    let i = 0;

                    while(i != reservations.length)
                    {
                        let arrayDate = reservations[i].date.split("/")
                        let date = (new Date(parseInt(arrayDate[2]),parseInt(arrayDate[1]) - 1,parseInt(arrayDate[0]))).getTime()
                        if(currDate > date)
                            reservations.splice(i,1)
                        else
                            i++
                    }

                    res.json({'message' : '1', 'reservations' : reservations})
                }
                else
                    res.json({'message' : '0'})
            }
        )
    }

  
    makePractise = (req:express.Request, res:express.Response) => {

        let academy_players = req.body.players.split(",")
        Reservation.collection.insertOne(
            {
                'reservedByWho' : req.body.email,
                'starts' : req.body.starts,
                'ends' : req.body.ends,
                'type' : req.body.type,
                'court' : req.body.court,
                'date' : req.body.date,
                'status' : '1',
                'academy_players' : academy_players,
                'description' : ''
            },
            (err , reservation) => {
                if(!err && reservation)
                {
                    res.json({'message' : '1'})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )

    }

    myPractises = async (req:express.Request, res:express.Response) => {
        let ret_practises = []
        Reservation.find(
            {
                'academy_players' : 
                {
                    $elemMatch :
                    {
                        $eq : req.body.email
                    }
                },
                'status' : '1'
            },
            async (err, practises) => {
                if(!err && practises)
                {
                    
                    ret_practises = JSON.parse(JSON.stringify(practises))
                    for(let i = 0; i < practises.length; i++)
                    {

                        await User.findOne(
                            {
                                'email' : practises[i].reservedByWho
                            }
                            ,(err, coach) =>{
                                if(!err && coach)
                                    ret_practises[i].reservedByWho = coach.firstName + ' ' + coach.lastName
                            }
                        ).clone()

                        ret_practises[i].academy_players = []
                        
                        for(let j = 0; j < practises[i].academy_players.length; j++)
                        {

                            if(practises[i].academy_players[j] != req.body.email)
                            await User.findOne(
                                {
                                    'email' : practises[i].academy_players[j]
                                },
                                (err, user) => {
                                    ret_practises[i].academy_players.push(user.firstName + ' ' + user.lastName)
                                }
                            ).clone()

                        

                        }

                    }
                    res.json({'message' : '1', 'practises' : ret_practises})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )

    }


    batchReservationDelete = (req:express.Request, res:express.Response) => {

        let array : string[] = JSON.parse(req.body.array)

        let delArray = [];

        for(let i = 0; i < array.length; i++)
        {
            delArray.push(ObjectId(array[i]))

          
        }

        Reservation.collection.deleteOne(
            {
                '_id' : {
                    $in : delArray
                }
            }
        )
    }

    getCoachesPractises = (req:express.Request, res:express.Response) => {

        Reservation.find(
            {
                'reservedByWho' : req.body.email,
                'type' : 'practise',
                'status' : '1'
            },
            (err, practises) => {
                if(!err && practises)
                {
                    res.json({'message' : '1', 'practises' : practises})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )

    }

    editReservation = (req:express.Request, res:express.Response) => {

        Reservation.collection.updateOne(
            {
                '_id' : ObjectId(req.body.id)
            }
            ,
            {
                $set : 
                {
                    'description' : req.body.description,
                    'status' : '4'
                }
            },
            (err, rez) => {
                if(!err && rez)
                {
                    res.json({'message' : '1'})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )
        
    }

    coachDiary = (req:express.Request, res:express.Response) => {

        Reservation.find(
            {
                'reservedByWho' : req.body.email,
                'type' : 'practise',
                'status' : '4'
            },
            (err, myDiary) => {
                if(!err && myDiary)
                {
                    res.json({'message' : '1', 'myDiary' : myDiary})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )

    }
}