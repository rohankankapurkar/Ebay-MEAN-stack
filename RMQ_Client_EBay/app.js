
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bcrypt = require('bcrypt');
var http = require('http');
//var winston = require('winston');
var passport = require("passport");

const winston = require('winston')

winston.log('info', 'Hello log files!', {  
  sample: 'some-value'
});
winston.level = 'debug'  ;
winston.level = process.env.LOG_LEVEL  


var fs = require('fs');
var util = require('util');
var logFile = fs.createWriteStream('log.txt', { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
var logStdout = process.stdout;

console.log = function () {
  logFile.write(util.format.apply(null, arguments) + '\n');
  logStdout.write(util.format.apply(null, arguments) + '\n');
}
console.error = console.log;
winston.level = 'debug';
winston.log('debug', 'Now my debug messages are written to console!');
winston.add(winston.transports.File, { filename: 'somefile.log' });


var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var product = require('./routes/product');
var app = express();


//URL for the sessions collections in mongoDB
var mongoSessionConnectURL = "mongodb://localhost:27017/login";
//var expressSession = require("express-session");
var mongoStore = require("connect-mongo")(session);
var mongo = require("./routes/mongo");





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//code for bcrypt
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';





// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret: 'ssshhh '}));

app.use(session({
	secret: 'cmpe273_teststring',
	resave: false,  //don't save session if unmodified
	saveUninitialized: false,	// don't create session until something stored
	duration: 30 * 60 * 1000,    
	activeDuration: 5 * 60 * 1000,
	store: new mongoStore({
		url: mongoSessionConnectURL
	})
}));

app.use('/', routes);
app.use('/users', users);
//passport authentication added here
app.post('/afterSignIn', function(req, res, next) {
	console.log("hi");
	console.log(req.body);
	passport.authenticate('signin', function(err, user) {
		if (err) {
			console.log(err);
		}
		if (user) {
			req.session.username = user.username;
			console.log(req.session.username);
			console.log('Before sending');
			res.send({
				'statusCode' : 200
			});
		} else {
			res.send({
				'statusCode' : 401
			});
		}

		console.log("Session started in Passport");
	})(req, res, next);
});                        

app.post('/checklogin',home.afterSignIn);
//app.post('/buy',product.buy);
app.get('/signin', home.signin);


app.get('/signout', home.logout);
//app.post('/afterSignIn',home.afterSignIn);
app.get('/afterSignIn',home.login);
//app.get('/buy',home.getAllUsers);
app.get('/register', home.register);
app.post('/registeruser', home.registeruser);
app.post('/sell',home.sell);
app.post('/buy',home.buy);
app.post('/buy2',home.buy2);

app.post('/addToCart',home.addToCart);
app.post('/cart',home.cart);
app.post('/purchase',home.purchase);
app.post('/history',home.history);
app.post('/yourads',home.yourads);
app.post('/info',home.info);
app.post('/info1',home.info1);
app.post('/addToBid',home.addToBid);
app.post('/delete',home.deleteCart);
app.post('/bidding',home.bidding);






// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




function showDate(){
	  var date = new Date(),
	    str = date.toUTCString();

	  return str;
	}

	var orig = console.log;

	console.log = function() {
	  var msgs = [];

	  while(arguments.length) {
	      msgs.push("[" + showDate() + "]" + ': ' + [].shift.call(arguments));
	  }

	  orig.apply(console, msgs);
	};





module.exports = app;



