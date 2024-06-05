import { match } from 'assert'
import { create } from 'domain'
import express, { Request } from 'express'
import { Response } from 'express-serve-static-core'
import { Admin } from 'mongodb'
import mongoose, { Schema, mongo } from 'mongoose'
import { parse } from 'path'
import { json } from 'stream/consumers'
import { resourceLimits } from 'worker_threads'
const fs = require('fs')
let mongoosee = require('mongoose')
const { ObjectId } = require('mongodb');

const Reservation = require('../models/reservation.model');
const User = require('../models/user.model');
const Tournament = require('../models/tournament.model')
const TournamentMatch = require('../models/tournament_match.model')
const TournamentRegistration = require('../models/tournament_registration.model')
export class TournamentComponent{

    getTournamentByName = (req:express.Request, res:express.Response) =>{

        Tournament.findOne(
            {
                'name' : req.body.name
            },
            (err, tournament) =>
            {
                if(!err && tournament)
                {
                    res.json({'message' : '1', 'tournament' : tournament})
                }
                else
                {
                    res.json({'message' : '0'})
                }
            }
        )

    }

    getAllTournaments = (req:express.Request, res:express.Response) =>{
        Tournament.find(
            {
                'status' : { $ne : '3'}
            }, 
            (err, tours) => {
                if(tours){
                    res.json({
                        'message' : '1',
                        'tours' : tours
                    })
                }
            }
        )
    }

    getAllActiveTournaments = (req:express.Request, res:express.Response) =>{
        Tournament.find(
            {$or : [
                {'status' : '1'},
                {'status' : '2'}
            ]}, 
            (err, tours) => {
                if(tours){
                    res.json({
                        'message' : '1',
                        'tours' : tours
                    })
                }
            }
        )
    }

    getAllRegTournaments = (req:express.Request, res:express.Response) =>{
        Tournament.find(
            {'status' : '0'}, 
            (err, tours) => {
                if(tours){
                    res.json({
                        'message' : '1',
                        'tours' : tours
                    })
                }
            }
        )
    }

    getTournamentReservations = ( async (req:express.Request, res:express.Response) =>{
        let  tournamentID;

        Tournament.findOne({'name' : req.body.name}, (err, tID) => {
            if(err) {
                res.json({"message" : "-1"});
            }
            else{
                if(tID){
                    
                    TournamentMatch.find({
                        'tournament' : mongoosee.Types.ObjectId(tID['_id'])
                    }, async (err, tMatches) => {
                        if(err){
                            res.json({'message' : '-1'})
                        }
                        else{  
                            //console.log(tMatches)
                            if(tMatches){
                                let usersArray = []
                                User.find({'1' : '1'},
                                (err, users) => {
                                    
                                    for(let i = 0; i < tMatches.length; i++){
                                        let p1 = null, p2 = null;
                                       
                                        for(let j = 0; j < users.length; j++){
                                            if(users[j].email == tMatches[i].player1)
                                                p1 = users[j].firstName + ' ' + users[j].lastName

                                            if(users[j].email == tMatches[i].player2)
                                                p2 = users[j].firstName + ' ' + users[j].lastName

                                            if(p1 && p2) break;
                                        }

                                        usersArray.push({
                                            'player1' : p1,
                                            'player2' : p2,
                                            'index' : tMatches[i]['index']
                                            }
                                        )
                                    }
                                    
                                    res.json({'message' : '1', 'matches' : tMatches, 'tournament' : tID , 'playerNamesPerMatch' : usersArray});
                                })                                
                            }
                            else{
                                res.json({'message' : '00'})
                            }
                        }
                    })

                }
                else{

                }
            }
        })
    })  

    createNewTournament = (req:express.Request, res:express.Response) =>{
        Tournament.findOne(
            {
                'name' : req.body.name,
                'status' : '1'
            },
            (err, tournament) => {
                if(tournament){
                    res.json({'message' : '2'}) 
                }
                else{
                    Tournament.collection.insertOne(
                        {
                            'starts' : req.body.starts,
                            'ends' : req.body.ends,
                            'name' : req.body.name,
                            'prize' : req.body.prize,
                            'capacity' : req.body.capacity,
                            'status' : '0'
                        },
                        (err, tour) => {
                            if(tour){
                                res.json({'message' : '1'})
                            }
                            else{
                                res.json({'message' : '0'}) 
                            }
                        }
                    )
                }
            }
        )     
    }

    editTournamentMatch = async (req : express.Request, res : express.Response) => {

        let _id = req.body._id
        let player1 = req.body.player1
        let player2 = req.body.player2
        let result = req.body.result
        let status = req.body.status
    
        
        if(typeof(player1) == 'undefined')
            player1 = null

        if(typeof(player2) == 'undefined')
            player2 = null

        if(typeof(result) == 'undefined')
            result = null

        if(typeof(status) == 'undefined')
            status = null
        
        let flag = true;
        let match = null;
        
        if(status != null){
            if(status == '5'){
            /*
        
                            )*/ 
            let tournamID;
            Tournament.findOne(
                {'name' : req.body.tournament},
                (err, tour) =>{
                    if(!err && tour){

                        tournamID = tour._id

                    }

                    TournamentMatch.collection.insertOne(
                        {
                            'reservation' : null,
                            'player1' : player1,
                            'player2' : '',
                            'result' : '',
                            'tournament' :  mongoosee.Types.ObjectId(tournamID),
                            'index' : req.body.index,
                            'status' : '5'
                            
                        },
                        (err, result) => {
                        
                            if(!err && result){
                                
                                TournamentMatch.findOne({ '_id' : result.insertedId},
                                (errr, mat) => {
                                    if(!errr && mat){
                                        
                                        match = mat
                                        //console.log(match)
                                        
                                        res.json({'message' : '1', 'match' : match})
                                    }
                                    else
                                        res.json({'message' : '0'})
                                       
                                })
                                
                            }
                            else
                                res.json({'message' : '0'})
                            
                        }
                    )
                }
            )
            }
            else{
                TournamentMatch.findOne(
                    {
                        '_id' : _id
                    },
                    (err, tourMatch) => {
                        if(!err && tourMatch){
    
                            TournamentMatch.collection.updateOne(
                                {
                                    '_id' : tourMatch._id
                                },
                                {
                                    $set : {
                                        'player1' : (player1 != null) ? player1 : tourMatch.player1,
                                        'player2' : (player2 != null) ? player2 : tourMatch.player2,
                                        'status' : (status != null) ? status : tourMatch.status,
                                        'result' : (result != null) ? result : tourMatch.result
                                        
                                    }
                                },
                                (err, tm) => {
                                    if(!err && tm){
                                        res.json({'message' : '1'})
                                    }
                                    else{
                                        res.json({'message' : '0'})
                                    }
                                }
                            )
    
                        }
                    }
                )
            }
        
        }
        else{
            //console.log(result + ' ' + req.body.result)

            TournamentMatch.findOne(
                {
                    '_id' : _id
                },
                (err, tourMatch) => {
                    if(!err && tourMatch){

                        TournamentMatch.collection.updateOne(
                            {
                                '_id' : tourMatch._id
                            },
                            {
                                $set : {
                                    'player1' : (player1 != null) ? player1 : tourMatch.player1,
                                    'player2' : (player2 != null) ? player2 : tourMatch.player2,
                                    'status' : (status != null) ? status : tourMatch.status,
                                    'result' : (result != null) ? result : tourMatch.result
                                }
                            },
                            (err, tm) => {
                                if(!err && tm){
                                    res.json({'message' : '1'})
                                }
                                else{
                                    res.json({'message' : '0'})
                                }
                            }
                        )

                    }
                }
            )
        
        }
    }

    createTournamentMatch = (req : express.Request, res : express.Response) => {

        Tournament.findOne(
            {'name' : req.body.tournament},
            (err, tour) => {
                if(!err && tour){
                    TournamentMatch.collection.insertOne(
                        {
                            'player1' : req.body.player1,
                            'player2' : req.body.player2,
                            'status' : '1',
                            'reservation' : null,
                            'index' : req.body.index,
                            'result' : '',
                            'tournament' : mongoosee.Types.ObjectId(tour._id)
                            
                        },
                        (err, tm) => {
                            if(!err && tm){
                                TournamentMatch.findOne(
                                    {
                                        '_id' : tm.insertedId
                                    },
                                    (err, tmm) => {
                                        if(!err && tmm){
                                            res.json({'message' : '1', 'match' : tmm})
                                        }
                                        else{
                                            res.json({'message' : '0'})
                                        }            
                                    }
                                )
                               
                            }
                            
                        }
                    )
                }
            }
        )
        

    }

    deleteTournamentMatch = (req:express.Request, res:express.Response) => {
        let resId = null;
        if(typeof req.body.resId != 'undefined')
            resId = req.body.resId;


        
        Reservation.findOne(
            {
                '_id' : resId
            },
            (err, foundRes) => {
                if(foundRes){
                    Reservation.collection.deleteOne(
                        {
                            '_id' : ObjectId(resId)
                        },
                        (err, deletedRes) => {
                            if(!err) {
                                TournamentMatch.collection.deleteOne(
                                    {
                                        '_id' :  ObjectId(req.body.match_id)
                                    },
                                    (err, deletedMatch) => {
                                        if(!err){
                                            res.json({'message' : '1'})
                                        }
                                        else{
                                            res.json({'message' : '0'})
                                        }
                                    }
                                )
                            }
                        }
                    )
                }
                else{
                    TournamentMatch.collection.deleteOne(
                        {
                            '_id' : ObjectId(req.body.match_id)
                        },
                        (err, deletedMatch) => {
                            if(!err){
                                res.json({'message' : '1'})
                            }
                            else{
                                res.json({'message' : '0'})
                            }
                        }
                        )
                }
            }
            ) 
        }


        findWinner(match)
        {
            if(match.status[0] == '4')
            {
                if(match.status[1] == '1') return '2'
                else return '1'
            }

            if(match.status == '5') return '1'

            if(match.result.split(';').length == 2)
            {
                if(parseInt(match.result.split(';')[1].split(':')[0]) > parseInt(match.result.split(';')[1].split(':')[1]))
                    return '1';
                else return '2';
            }
            else
            if(parseInt(match.result.split(';')[2].split(':')[0]) > parseInt(match.result.split(';')[2].split(':')[1]))
                return '1';
            else return '2';
            

        }
        finishTournament = async (req:express.Request, res:express.Response) => {
            let id = req.body.id

            Tournament.findOne(
                {
                    '_id' :  ObjectId(id)
                }
                ,(err, tournament) => {
                    if(!err && tournament) {

                        TournamentMatch.find(
                            {
                                'tournament' : ObjectId(id)
                            },
                            async (err, matches) => {
                                if(!err && matches) {
                                    let flag = true;

                                    if(matches.length == (parseInt(tournament.capacity) - 1))
                                    {

                                        for(let i = 0 ; i < matches.length;i++)
                                        {
                                            if(matches[i].status != '3' && matches[i].status != '5' && matches[i].status[0] != '4')
                                            {
                                                flag = false;
                                                break;
                                            }
                                        }
                                        //check if all finished
                                        
                                        if(flag)
                                        {
                                            let i = 1;
                                            let height = -1;
                                            while(i != parseInt(tournament.capacity))
                                            {
                                                i <<= 1;
                                                height++;
                                            }
    
                                            matches.sort( (elem1, elem2) => {
                                                return parseInt(elem1.index) - parseInt(elem2.index)
                                            })
    
    
                                            let looser : string = null;
                                            let boundary = 1 << height
    
                                            for(let j = 0; j < parseInt(tournament.capacity) - 1; j++)
                                            {
                                                
                                                if(j == boundary)
                                                {
    
                                                    height--
                                                    boundary = boundary | (boundary >> 1)
                                                }
    
                                                looser = (this.findWinner(matches[j]) == '1') ? matches[j].player2 : matches[j].player1 // ovde se zapravo nalazi onaj koji je izgubio
                                                    
                                                await User.collection.updateOne(
                                                    {
                                                        'email' : looser
                                                    },
                                                    {
                                                        $inc : 
                                                        {
                                                            'points' : Math.round((parseInt(tournament.prize) / (height + 2)))
                                                        }
                                                    }
                                                )
                                            }
                                            let finalIndex = parseInt(tournament.capacity) - 2
                                            let winner = (this.findWinner(matches[finalIndex]) == '1') ? matches[finalIndex].player1 : matches[finalIndex].player2
                                            await User.collection.updateOne(
                                                {
                                                    'email' : winner
                                                },
                                                {
                                                    $inc : 
                                                    {
                                                        'points' : (parseInt(tournament.prize))
                                                    }
                                                }
                                            )
                                            await Tournament.collection.updateOne(
                                                {
                                                    '_id' : ObjectId(id)
                                                },
                                                {
                                                    $set : 
                                                    {
                                                        'status' : '2'
                                                    }
                                                }
                                            )

                                            res.json({'message' : '1'})

                                        }
                                        else
                                        {
                                            res.json({'message' : '0'})
                                        }
                                        
                                            
                                    }
                                    else
                                    {
                                        res.json({'message' : '0'})
                                    }

                                }
                            }
                        )

                    }
                }
            )
        }

        activateTournament = (req:express.Request, res:express.Response) => {

            Tournament.collection.updateOne(
                {
                    '_id' : ObjectId(req.body.id)
                },
                {
                    $set : 
                    {
                        'status' : '1'
                    }
                },
                (err, tournament) => {
                    if(!err && tournament) 
                    {
                        res.json({'message' : '1'})
                    }
                }
            )
        }

        deleteTournament = (req:express.Request, res:express.Response) => {

            Tournament.collection.updateOne(
                {
                    '_id' : ObjectId(req.body.id)
                },
                {
                    $set : 
                    {
                        'status' : '3'
                    }
                },
                (err, tournament) => {
                    if(!err && tournament) 
                    {
                        res.json({'message' : '1'})
                    }
                }
                

            )
        }

        registerForTournament = (req:express.Request, res:express.Response) => {

            TournamentRegistration.collection.insertOne(
                {
                    'tournament' : ObjectId(req.body.tournament),
                    'player' : req.body.player,
                    'status' : '0'
                },
                (err, reg) => {

                    if(!err && reg)
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

        unregisterFromTournament = (req:express.Request, res:express.Response) => {

            TournamentRegistration.collection.deleteOne(
                {
                    '_id' : ObjectId(req.body.id)
                },
                (err, reg) => {

                    if(!err && reg)
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


        registeredPlayers = (req:express.Request, res:express.Response) => {
            let pipeline = []

            pipeline.push({'1' : '1'})

            if(typeof req.body.tournament != 'undefined')
            {
                pipeline.push({'tournament' : ObjectId(req.body.tournament)})
            }

            if(typeof req.body.player != 'undefined')
            {
                pipeline.push({'player' : req.body.player})
            }
            

            TournamentRegistration.find(
                {
                    $and : pipeline
                }
                ,
                (err, registered) => {
                    if(!err && registered)
                    {
                        res.json({'message' : '1', 'registered' : registered})
                    }
                    else
                    {
                        res.json({'message' : '0'})
                    }
                }
            )
        }

        playersRegistrations = (req:express.Request, res:express.Response) => {

            TournamentRegistration.find(
                {
                    'player' : req.body.player
                }
                ,
                (err, registered) => {
                    if(!err && registered)
                    {
                        res.json({'message' : '1', 'registered' : registered})
                    }
                    else
                    {
                        res.json({'message' : '0'})
                    }
                }
            )

        }

        registeredPerTournament = async (req:express.Request, res:express.Response) => {
            let createdTournaments : mongoose.Types.ObjectId[] = []
            await Tournament.find(
                {
                    'status' : '0'
                },
                (err, tournaments) => {

                    if(!err && tournaments.length != 0)
                    {
                        for(let i = 0;  i < tournaments.length; i++)
                        {
                            createdTournaments.push(ObjectId(tournaments[i]._id))
                        }
                    }
                }
            ).clone()
            
            await TournamentRegistration.aggregate(
               [
                {
                    $match : {
                       'tournament' : {
                            $in : createdTournaments
                       }
                    },
                    
                },
                {
                    $group : {
                      "_id" : '$tournament',
                      "count" : { $sum: 1 }
                    }

                }
               ]
            ).then(
                (reg) => {
                    if(reg) 
                    {   
                        
                        res.json({'message' : '1', "regPerTour" : reg})
                    }
                    else
                    {
                        res.json({'message' : '0'})
                    }
                }
            )
        }

}