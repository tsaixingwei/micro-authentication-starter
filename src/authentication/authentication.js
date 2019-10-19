const { json, text, send, createError } = require('micro');
const { compareSync, hash } = require('bcrypt');
const { sign, verify } = require('jsonwebtoken');
var mongoose = require('mongoose');
const assert = require('assert');

const { secret } = require('../config');
const User = require('../models/user');

/**
 * Attempt to authenticate a user.
 */
const attempt = (username, password) => {
  return User.find({ username: username }).exec().then((users, err) => {
    if (!users.length) {
      throw createError(401, 'That user does not exist');
    }

    const user = users[0];
    if (!compareSync(password, user.password)) {
      throw createError(401, 'Wrong password');
    }
    return user;
  });
};

/**
 * Authenticate a user and generate a JWT if successful.
 * TODO: handle iss, aud, and exp if passed into the token.
 */
const auth = ({ username, password, iss, aud, exp }) =>
  attempt(username, password).then(({ id }) => {
    const payload = {
      id: id,
      username: username,
    };

    // see: https://www.npmjs.com/package/jsonwebtoken
    let options = {};
    if (iss) options.issuer = iss;
    if (aud) options.audience = aud;
    if (exp) options.expiresIn = exp;
    //console.log("options: ", options);

    let token = sign(payload, secret, options);
    return { token: token };
  });

// the jsonwebtoken.verify() with also validation expiration, audience or issuer
// if these exists in the token.
const decode = token => verify(token, secret);

module.exports.login = async (req, res) => {
  return await auth(await json(req));
}

module.exports.decode = (req, res) => decode(req.headers['authorization']);
