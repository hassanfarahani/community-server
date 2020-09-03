const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const users = require('../queries/users')

// on first login
const { setAdminIfNotExists } = require('../auth/utils')

// Strategy config
// To instantiate google strategy we give it our app id and app secret variables and the callbackURL that
// (2): we’ll use to authenticate the user. As a second parameter, it takes a function that will return the profile info provided by the user.
passport.use(new GoogleStrategy({
    // we're gonna grab clientId & clientSecret from our environment variables
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, cb) => {
      // user accepted the google confirmation screen
      // here is where we inserting the user into the db or finding the user from the db (update an existing user)
      // we now need to connect to the db (inserting the knexfile.js and db folder)
      const email = profile.emails[0].value

      const googleUser = {
        display_name: profile.displayName,
        email,
        google_id: profile.id,
        image_url: profile.photos[0].value,
        role_id: 1
      }

      try {
        let user = await users.findByEmail(email)
        if (user) {
          // update the user
          googleUser.role_id = user.role_id
          user = await users.update(user.id, googleUser)
        } else {
          // insert the user
          const admins = await users.findAdmins()
          if (admins.length === 0) {
            googleUser.role_id = 3
          }
          // const user = await setAdminIfNotExists(user)
          user = await users.insert(googleUser)
        }
        return cb(null, user) // passes the profile data to serializeUser (this is either passing the error or the user)
      } catch(error) {
        return cb(error)
      }


  }
));


// Configure Strategy
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
