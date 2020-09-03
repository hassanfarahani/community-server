"use strict";

var express = require('express');

var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

var passport = require('passport');

var cors = require('cors'); // dotenv will reboots inside of our environmental variables file so that when it reaches google.js. clientID & clientSecret have
// actual values that are in .env file
// config: reads the env.file so JavaScript can use them


require('dotenv').config();

var _require = require('./middlewares'),
    notFound = _require.notFound,
    errorHandler = _require.errorHandler,
    checkAuthHeaderSetUser = _require.checkAuthHeaderSetUser,
    checkAuthHeaderSetUserUnAuthorized = _require.checkAuthHeaderSetUserUnAuthorized;

var auth = require('./auth');

var api = require('./api');

var app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize()); // Before any other route, we are gonna check the incoming header to see if it has a TOKEN in it

app.use(checkAuthHeaderSetUser); // for unauthorized user, we are gonna redirect the user to login page on the client side because
//  the backend does not have a login page, it just have a way of redirecting to google

app.get('/', function (req, res) {
  res.json({
    message: 'Welcome to Community API!'
  });
}); // any request that begins with /auth is gonna hit the auth router

app.use('/auth', auth);
app.use('/api/v1/', api);
app.use(notFound);
app.use(errorHandler);
module.exports = app;