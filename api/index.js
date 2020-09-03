//  All of the api routes
const express = require('express')

const router = express.Router()

const categories = require('./categories')

router.use('/categories', categories)

module.exports = router