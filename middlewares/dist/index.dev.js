"use strict";

var _require = require('../auth/utils'),
    verify = _require.verify; // grab the authorization header from the incoming request, which will have the token in it, and then verify it


function checkAuthHeaderSetUser(req, res, next) {
  var authorization, token, user;
  return regeneratorRuntime.async(function checkAuthHeaderSetUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          authorization = req.get('authorization');

          if (!authorization) {
            _context.next = 13;
            break;
          }

          // authorization=Bearer token
          token = authorization.split(' ')[1];
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(verify(token));

        case 6:
          user = _context.sent;
          req.user = user; // in any subsequent route, you have access to req.user

          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          // verification does not happen
          console.error(_context.t0);

        case 13:
          next();

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 10]]);
}

function checkAuthHeaderSetUserUnAuthorized(req, res, next) {
  var authorization, token, user;
  return regeneratorRuntime.async(function checkAuthHeaderSetUserUnAuthorized$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          authorization = req.get('authorization');

          if (!authorization) {
            _context2.next = 14;
            break;
          }

          // authorization=Bearer token
          token = authorization.split(' ')[1];
          _context2.prev = 3;
          _context2.next = 6;
          return regeneratorRuntime.awrap(verify(token));

        case 6:
          user = _context2.sent;
          req.user = user; // in any subsequent route, you have access to req.user

          return _context2.abrupt("return", next());

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](3);
          // verification does not happen
          console.error(_context2.t0);

        case 14:
          // if there was no Authorization header
          res.status(401);
          next(new Error('Un-Authorized ...'));

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[3, 11]]);
}

function isAdmin(req, res, next) {
  if (req.user && req.user.role_id === 3) {
    next();
  }

  res.status(401);
  next(new Error('Un-Authorized ...'));
}

function notFound(req, res, next) {
  var error = new Error('Not Found - ' + req.originalUrl);
  res.status(404);
  next(error);
}

function errorHandler(error, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: error.message,
    error: process.env.NODE_ENV === 'production' ? {} : error.stack
  });
}

module.exports = {
  notFound: notFound,
  errorHandler: errorHandler,
  checkAuthHeaderSetUser: checkAuthHeaderSetUser,
  checkAuthHeaderSetUserUnAuthorized: checkAuthHeaderSetUserUnAuthorized,
  isAdmin: isAdmin
}; // Bearer Tokens are the predominant type of access token used with OAuth 2.0.
// A Bearer token basically says "Give the bearer of this token access".
// A Bearer Token is set in the Authorization header of every Inline Action HTTP Request. For example:
// POST /rsvp?eventId=123 HTTP/1.1
// Host: events-organizer.com
// Authorization: Bearer AbCdEf123456
// Content-Type: application/x-www-form-urlencoded
// User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/1.0 (KHTML, like Gecko; Gmail Actions)
// rsvpStatus=YES
// The string "AbCdEf123456" in the example above is the bearer authorization token. This is a cryptographic token produced by the authentication server. All bearer tokens sent with actions have the issue field, with the audience field specifying the sender domain as a URL of the form https://. For example, if the email is from noreply@example.com, the audience is https://example.com.
// If using bearer tokens, verify that the request is coming from the authentication server and is intended for the the sender domain. If the token doesn't verify, the service should respond to the request with an HTTP response code 401 (Unauthorized).
// Bearer Tokens are part of the OAuth V2 standard and widely adopted by many APIs.
// we can do two types of middleware:
// checkAuthHeaderSetUser is just gonna set the user if it exists
// we could create another one that if the Authorization header is not set or if it does not verify, just send unauthorized
// to check this, we should generate a token using some other secret & our server should deny it.
// our server says: this was not generated using my token. (json web token signer)