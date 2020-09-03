const { verify } = require('../auth/utils')

// grab the authorization header from the incoming request, which will have the token in it, and then verify it
async function checkAuthHeaderSetUser(req, res, next) {
    const authorization = req.get('authorization')
    if (authorization) {
        // authorization=Bearer token
        const token = authorization.split(' ')[1]
        try {
            const user = await verify(token)
            req.user = user
            // in any subsequent route, you have access to req.user
        } catch(error) {
            // verification does not happen
            console.error(error)
        }
    }
    next()
}

async function checkAuthHeaderSetUserUnAuthorized(req, res, next) {
    const authorization = req.get('authorization')
    if (authorization) {
        // authorization=Bearer token
        const token = authorization.split(' ')[1]
        try {
            const user = await verify(token)
            req.user = user
            // in any subsequent route, you have access to req.user
            return next()
        } catch(error) {
            // verification does not happen
            console.error(error)
        }
    }
    // if there was no Authorization header
    res.status(401)
    next(new Error('Un-Authorized ...'))
}

function isAdmin(req, res, next) {
    if (req.user && req.user.role_id === 3) {
        return next()
    }
    res.status(401)
    next(new Error('Un-Authorized ...'))
}

function notFound(req, res, next) {
    const error = new Error('Not Found - '+ req.originalUrl)
    res.status(404)
    next(error)
}

function errorHandler(error, req, res, next) {
    res.status(res.statusCode || 500)
    res.json({
        message: error.message,
        error: process.env.NODE_ENV === 'production' ? {} : error.stack,
    })
}

module.exports = {
    notFound,
    errorHandler,
    checkAuthHeaderSetUser,
    checkAuthHeaderSetUserUnAuthorized,
    isAdmin
}


// Bearer Tokens are the predominant type of access token used with OAuth 2.0.
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