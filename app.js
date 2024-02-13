const { GoogleGenerativeAI } = require("@google/generative-ai");
const serviceAccount = require('/Users/admin/Documents/CodingProjects/financify-api/financify-a6517-firebase-adminsdk-ezvll-07cbc7ccc9.json');
const admin = require('firebase-admin');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();


var indexRouter = require('./routes/index');
var promptRouter = require('./routes/prompt');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Initializes Firebase Admin Setup

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// ...
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


// MIDDLEWARE
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// API ROUTES
app.use('/', indexRouter);
app.use('/prompt', promptRouter);
app.use('/prompt/userInput/uid', promptRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
