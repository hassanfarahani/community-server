"use strict";

//  All of the api routes
var express = require('express');

var router = express.Router();

var categories = require('./categories');

router.use('/categories', categories);
module.exports = router;