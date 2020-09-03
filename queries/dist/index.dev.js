"use strict";

// commomn queries for all tables in db
var Joi = require('joi');

var db = require('../db');

function insertIntoTableAndValidate(table_name, item, schema) {
  var rows;
  return regeneratorRuntime.async(function insertIntoTableAndValidate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // https://joi.dev/api/?v=17.2.1
          Joi.assert(item, schema); // Joi.assert will throw an error upon encountering the first validation failure, so the following code will never execute

          _context.next = 3;
          return regeneratorRuntime.awrap(db(table_name).insert(item, '*'));

        case 3:
          rows = _context.sent;
          return _context.abrupt("return", rows[0]);

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
}

module.exports = {
  insertIntoTableAndValidate: insertIntoTableAndValidate
};