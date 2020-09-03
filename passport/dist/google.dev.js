"use strict";

var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

var users = require('../queries/users'); // on first login


var _require = require('../auth/utils'),
    setAdminIfNotExists = _require.setAdminIfNotExists; // Strategy config
// To instantiate google strategy we give it our app id and app secret variables and the callbackURL that
// (2): we’ll use to authenticate the user. As a second parameter, it takes a function that will return the profile info provided by the user.


passport.use(new GoogleStrategy({
  // we're gonna grab clientId & clientSecret from our environment variables
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, function _callee(accessToken, refreshToken, profile, cb) {
  var email, googleUser, user, admins;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // user accepted the google confirmation screen
          // here is where we inserting the user into the db or finding the user from the db (update an existing user)
          // we now need to connect to the db (inserting the knexfile.js and db folder)
          email = profile.emails[0].value;
          googleUser = {
            display_name: profile.displayName,
            email: email,
            google_id: profile.id,
            image_url: profile.photos[0].value,
            role_id: 1
          };
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(users.findByEmail(email));

        case 5:
          user = _context.sent;

          if (!user) {
            _context.next = 13;
            break;
          }

          // update the user
          googleUser.role_id = user.role_id;
          _context.next = 10;
          return regeneratorRuntime.awrap(users.update(user.id, googleUser));

        case 10:
          user = _context.sent;
          _context.next = 20;
          break;

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(users.findAdmins());

        case 15:
          admins = _context.sent;

          if (admins.length === 0) {
            googleUser.role_id = 3;
          } // const user = await setAdminIfNotExists(user)


          _context.next = 19;
          return regeneratorRuntime.awrap(users.insert(googleUser));

        case 19:
          user = _context.sent;

        case 20:
          return _context.abrupt("return", cb(null, user));

        case 23:
          _context.prev = 23;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", cb(_context.t0));

        case 26:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 23]]);
})); // Configure Strategy
// The Google authentication strategy authenticates users using a Google account and OAuth 2.0 tokens.
//  The client ID and secret obtained when creating an application are supplied as options when creating the strategy.
//  The strategy also requires a verify callback, which receives the access token and optional refresh token,
// as well as profile which contains the authenticated user's Google profile.
// The verify callback must call cb providing a user to complete authentication.
// passport.serializeUser() is setting id as cookie in user’s browser and passport.deserializeUser() is getting id from the cookie,
// which is then used in callback to get user info or something else,
// based on that id or some other piece of information from the cookie…
// The user id (you provide as the second argument of the done function) is saved in the session and
//  is later used to retrieve the whole object via the deserializeUser function.
// ---------------------------------------------------------------------------------------------
// we only use serialize & deserialize if we are working with session
// // Used to stuff a piece of information into a cookie
// // serializeUser will be invoked on authentication and its job is to serialize the user instance and store it in the session via a cookie.
// // serializeUser determines which data of the user object should be stored in the session.
// // (3): The result of the serializeUser method is attached to the session as req.session.passport.user = {}.
// passport.serializeUser((user, done) => {
//     // console.log('user in serilaize:', user)
//     done(null, user.id);
//   });
// // Used to decode the received cookie and persist session
// // (4): deserializeUser will be invoked every subsequent request to deserialize the instance, providing it the unique cookie identifier as a “credential”
// passport.deserializeUser((id, done) => {
//     done(null, id);
// });
// ---------------------------------------------------------------------------------------------