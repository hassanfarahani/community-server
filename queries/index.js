// commomn queries for all tables in db
const Joi = require('joi');
const db = require('../db')

async function insertIntoTableAndValidate(table_name, item, schema) {
    // https://joi.dev/api/?v=17.2.1
    Joi.assert(item, schema)
    // Joi.assert will throw an error upon encountering the first validation failure, so the following code will never execute
    const rows = await db(table_name).insert(item, '*')
    return rows[0]
}

module.exports = {
    insertIntoTableAndValidate
}