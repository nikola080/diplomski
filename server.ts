
import cors from 'cors'
import mongoose from 'mongoose'
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
app.use(cors())
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static('public'));


mongoose.connect("mongodb://127.0.0.1:27017/teniski_klub");
const conn = mongoose.connection;

conn.once('open',()=>{
    console.log('Uspesna konekcija');
});

const router = express.Router();
const guestRouter = require('./routes/user.route')
const reservationRouter = require('./routes/reservation.route')
const tournamenRouter = require('./routes/tournament.route')
router.use('/reservation',reservationRouter)
router.use('/guest',guestRouter)
router.use('/tournament',tournamenRouter)

app.use('/', router);

app.listen(4000, () => console.log(`Express server running on port 4000`));