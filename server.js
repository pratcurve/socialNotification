var express = require('express');
var app = express();
var session  = require('express-session');
var firebase = require('firebase');
var bodyParser = require('body-parser');
var request = require('request');

//required dabtabse config file and fcm file
var configDb = require('./config/database.js');
var notifyDb = require('./config/notifyDb.js');
var fcm = require('./app/fcm.js');
var subscribers = require('./app/subscribers.js');
// require('./config/mysqlevents.js');

//Middleware
app.use(session({secret: 'notify', httpOnly: false}));
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.set('view engine', 'jade');
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

//CORS Access control origin, to access from other domain
app.use(function(req, res, next){
	res.setHeader('Access-Control-Allow-Origin', "*");

	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


//app router
require('./app/routes.js')(app, configDb, notifyDb, fcm, session, subscribers);

app.all('/', function(req, res) {
	res.sendFile( __dirname + '/manifest.json');
});

//app listening on port 3000
app.listen(3000, function(){
	console.log('listening on *:3000');
});


