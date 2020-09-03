"use strict";

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var passport = require('passport'); // dotenv will reboots inside of our environmental variables file so that when it reaches google.js. clientID & clientSecret have
// actual values that are in .env file
// config: reads the env.file so JavaScript can use them


require('dotenv').config();

var _require = require('./middlewares'),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler;

var auth = require('./auth');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(passport.initialize());
app.get('/', function (req, res) {
  // res.sendFile(`${__dirname}/index.html`)
  res.json({
    message: 'Welcome to Community API!'
  });
}); // any request that begins with /auth is gonna hit the auth router

app.use('/auth', auth);
app.use(notFound);
app.use(errorHandler);
module.exports = app;