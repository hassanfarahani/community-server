// we create a single connection to the db so that anywhere else in our app, we'll just requiring in this connection
// first we need to figure out which environment we are in
const environment = process.env.NODE_ENV || 'development'

// now we need to grab configuration out of the knexfile
const knexConfig = require('../knexfile')
const environmentConfig = knexConfig[environment]
const knex = require('knex')
const connection = knex(environmentConfig)

module.exports = connection