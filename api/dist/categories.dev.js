"use strict";

var express = require('express');

var router = express.Router();

var _require = require('../middlewares'),
    checkAuthHeaderSetUserUnAuthorized = _require.checkAuthHeaderSetUserUnAuthorized,
    isAdmin = _require.isAdmin;

var categories = require('../queries/categories');

router.get('/', function _callee(req, res, next) {
  var all;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(categories.getAll());

        case 3:
          all = _context.sent;
          res.json(all);
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          next(_context.t0);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
router.post('/', checkAuthHeaderSetUserUnAuthorized, isAdmin, function _callee2(req, res, next) {
  var category;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(categories.insert(req.body));

        case 3:
          category = _context2.sent;
          res.json(category);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          next(_context2.t0);

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
});
module.exports = router;