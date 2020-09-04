// here we are going to create routes to provide authentication
// It is going to have login route & the callback route, which will give you your credentials

const passport = require('passport')
const express = require('express')
require('../passport/google')

const { create } = require('./utils')

const router = express.Router()

router.get('/isAdmin', async (req, res) => {
  if (req.user) {
    // if user logged in, and the role was admin
    if (req.user.role_id === 3) {
      return res.json({ isAdmin: true })
    }
  }
  res.json({ isAdmin: false })
})

// passport.authenticate middleware is used here to authenticate the request
// passport.authenticate attempts to authenticate with the given strategy on its first parameter, which is google
// (1) it sends the request to our Google app
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// The middleware receives the data from Google and runs the function on Strategy config
// (5): This is triggered by the callbackURL(cb), which Google will use to respond to the login request.
// custom callback from passport docs
// here we have custom access to what we get back ===> google
// (err, user) exactly matches up with cb(null, user) in google.js
// router.get('/google/callback', (req, res, next) => {
//   passport.authenticate('google', async (err, user) => {
//     if (err) { return next(err); }
//     try {
//       // create a JWT with the user & then redirect to the client side with that JWT (creating token & verifying token) --> create utils.js in auth folder
//       const token = await create(user)
//       // here server needs to redirect back to the client to give them this token so that they can make authorized request
//       res.redirect(`${process.env.CLIENT_REDIRECT}${token}`)
//     } catch(error) {
//       res.redirect(`${process.env.CLIENT_ERROR_REDIRECT}${error.message}`)
//     }
//   })(req, res, next);
// });
router.get('/google/callback', redirectToClientWithToken);

function redirectToClientWithToken(req, res, next) {
  passport.authenticate('google', async (err, user) => {
    if (err) { return next(err); }
    try {
      // create a JWT with the user & then redirect to the client side with that JWT (creating token & verifying token) --> create utils.js in auth folder
      const token = await create(user)
      // here server needs to redirect back to the client to give them this token so that they can make authorized request
      res.redirect(`${process.env.CLIENT_REDIRECT}${token}`)
    } catch(error) {
      res.redirect(`${process.env.CLIENT_ERROR_REDIRECT}${error.message}`)
    }
  })(req, res, next);
}

module.exports = router