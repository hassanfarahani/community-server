"use strict";

// we create a single connection to the db so that anywhere else in our app, we'll just requiring in this connection
// first we need to figure out which environment we are in
var environment = process.env.NODE_ENV || 'development'; // now we need to grab configuration out of the knexfile

var knexConfig = require('../knexfile');

var environmentConfig = knexConfig[environment];

var knex = require('knex');

var connection = knex(environmentConfig);
module.exports = connection;