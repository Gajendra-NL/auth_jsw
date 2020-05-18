const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signup = function(req, res, next) {
  console.log('check sign up', req.body)
  const email = req.body.email;
  const password = req.body.password;

  // vaidate input
  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide an email and password' });
  }

  // check if a user with given e mail exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    // if existing user, return an error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // if not, create and save user record
    const user = new User({
      email: email, password: password
    });

    user.save(function(err) {
      if (err) { return next(err); }

      // respond to request indicating user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}

exports.signin = function(req, res, next) {
  // user is already verified for user name and password using local  strategy
  // just need to return jwt token
  const user = req.user; // passport attaches returned obj from localLogin middleware to req
  res.send({ token: tokenForUser(user )});
}