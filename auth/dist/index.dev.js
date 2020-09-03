"use strict";

// here we are going to create routes to provide authentication
// It is going to have login route & the callback route, which will give you your credentials
var passport = require('passport');

var express = require('express');

require('../passport/google');

var _require = require('./utils'),
    create = _require.create;

var router = express.Router();
router.get('/isAdmin', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!req.user) {
            _context.next = 3;
            break;
          }

          if (!(req.user.role_id === 3)) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.json({
            isAdmin: true
          }));

        case 3:
          res.json({
            isAdmin: false
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
}); // passport.authenticate middleware is used here to authenticate the request
// passport.authenticate attempts to authenticate with the given strategy on its first parameter, which is google
// (1) it sends the request to our Google app

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
})); // The middleware receives the data from Google and runs the function on Strategy config
// (5): This is triggered by the callbackURL(cb), which Google will use to respond to the login request.
// custom callback from passport docs
// here we have custom access to what we get back ===> google
// (err, user) exactly matches up with cb(null, user) in google.js

router.get('/google/callback', function (req, res, next) {
  passport.authenticate('google', function _callee2(err, user) {
    var token;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!err) {
              _context2.next = 2;
              break;
            }

            return _context2.abrupt("return", next(err));

          case 2:
            _context2.prev = 2;
            _context2.next = 5;
            return regeneratorRuntime.awrap(create(user));

          case 5:
            token = _context2.sent;
            // here server needs to redirect back to the client to give them this token so that they can make authorized request
            res.redirect("".concat(process.env.CLIENT_REDIRECT).concat(token));
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2["catch"](2);
            res.redirect("".concat(process.env.CLIENT_ERROR_REDIRECT).concat(_context2.t0.message));

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[2, 9]]);
  })(req, res, next);
});
module.exports = router;