"use strict";

var Joi = require('joi');

var db = require('../db');

var _require = require('./index'),
    insertIntoTableAndValidate = _require.insertIntoTableAndValidate;

var schema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image_url: Joi.string()
});
module.exports = {
  getAll: function getAll() {
    return db('category').select();
  },
  insert: function insert(category) {
    return insertIntoTableAndValidate('category', category, schema);
  }
};