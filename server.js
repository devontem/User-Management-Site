/****************
 * BASE SETUP
****************/

// CALL THE PACKAGES
var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser'); // get body-parser
var morgan = require('morgan'); // used to see requests
var mongoose = require('mongoose'); // for working w/ our database
var port = process.env.PORT || 8080; // set the port for our app
var User = require('./app/models/user');//user model
var jwt = require('jsonwebtoken')
var config = require('./config');//configuration files
var path = require('path'); //static files

/*********************
 * APP CONFIGURATION
*********************/

//connect to db
mongoose.connect(config.database);

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
    Authorization');
    next();
});

// logs all requests to the console
app.use(morgan('dev'));

//set static files location
//used for requests the front end will make
app.use(express.static(__dirname + '/public'));



/**************
 * API ROUTES
***************/

//calling the api module.exports function with app & express args, returns apiRouter
var apiRouter = require('./app/routes/api')(app, express);
// binding apiRouter with '/api', all routes will be prefixed with /api
app.use('/api', apiRouter);

//main catchall route for site
//sends users to the frontend
//must be registered after apiRoutes (catches all routes not already handled i.e. apiRoutes is handled)
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});


/******************
 * STARTING SERVER
*******************/
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
