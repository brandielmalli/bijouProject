// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var mongodb  =require('mongodb');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

var db

// var twilio = require('twilio');
//
// // Find your account sid and auth token in your Twilio account Console.~send text
// var client = new twilio('AC4ca16f87242e544f9fe6fae576c30136', '75365c938fb824762f77427d46df46f3');







// configuration ===============================================================
mongoose.connect(configDB.url, { useMongoClient: true }, (err, database) => {
  if (err) return console.log(err)
  db = database

//calling a function - (routes) holds api
  require('./app/routes.js')(app, passport, db, mongodb);
}); // connect to our database


//function calling passport module
require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
//grabs client side files
app.use(express.static('public'))

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'rcbootcamp2018a', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
//require('./app/routes.js')(app, passport, db); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
