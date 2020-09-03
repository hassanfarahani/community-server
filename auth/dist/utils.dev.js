"use strict";

// we are gonna sign in the payload & create a JWT
var jwt = require('jsonwebtoken');

var users = require('../queries/users');

function create(user) {
  return new Promise(function (resolve, reject) {
    // first para: is the payload (what we want to put inside of JWT)
    // second param: is the secret -->server will use this to verify it was the one that signed with this token
    jwt.sign(user, process.env.TOKEN_SECRET, {
      expiresIn: '1d'
    }, function (error, token) {
      if (error) reject(error);
      resolve(token);
    });
  });
}

function verify(token) {
  return new Promise(function (resolve, reject) {
    // payload === user
    jwt.verify(token, process.env.TOKEN_SECRET, function (error, payload) {
      if (error) reject(error);
      resolve(payload);
    });
  });
}

module.exports = {
  create: create,
  verify: verify
}; // JWT or JSON Web Token is a string which is sent in HTTP request (from client to server) to validate authenticity of the client.
// But now, you don’t have to save JWT in database. Instead, you save it on client side only.
// JWT is created with a secret key and that secret key is private to you. When you receive a JWT from the client,
//  you can verify that JWT with that secret key. Any modification to the JWT will result into verification failure.
// JWT contains three distinct parts separated with dots (.):
// var JWT = HEADER_HASH + '.' + PAYLOAD_HASH + '.' + SIGNATURE_HASH
// header is simply a JSON string but it contains information about the algorithm of JWT encryption
// payload is any data that you want to include into JWT, it is also a JSON string.
// signature is an encrypted string. Whatever algorithm you choose in header part, you need to encrypt first two parts of JWT,
// which is base64(header) + '.' + base64(payload) with that algorithm.
// This is the only part of JWT which is not publically readable because it is encrypted with a secret key.
// Unless someone has the secret key, they can not decrypt this information.