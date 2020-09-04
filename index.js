const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const cors = require('cors')
const timeout = require('connect-timeout')

// dotenv will reboots inside of our environmental variables file so that when it reaches google.js. clientID & clientSecret have
// actual values that are in .env file
// config: reads the env.file so JavaScript can use them
require('dotenv').config()

const { notFound, errorHandler, checkAuthHeaderSetUser, checkAuthHeaderSetUserUnAuthorized } = require('./middlewares')

const auth = require('./auth')
const api = require('./api')

const app = express();

app.use(timeout('5s'))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors())
app.use(passport.initialize())

// Before any other route, we are gonna check the incoming header to see if it has a TOKEN in it
app.use(checkAuthHeaderSetUser)

// for unauthorized user, we are gonna redirect the user to login page on the client side because
//  the backend does not have a login page, it just have a way of redirecting to google
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Community API!'
    })
})

// any request that begins with /auth is gonna hit the auth router
app.use('/auth', auth)
app.use('/api/v1/', api)

app.use(notFound)

app.use(errorHandler)

module.exports = app;




var debug = require('debug')('server:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
