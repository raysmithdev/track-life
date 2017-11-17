const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const { User } = require('../user/user.model');
const config = require('../../config');
const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

const createAuthToken = user => {
  return jwt.sign({ user }, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

//check for username and password match
router.post('/login', (req, res) => {
  const userName = req.body.userName;
  const userPassword = req.body.userPassword;
  User.findOne({ userName: userName })
    .then(async (user) => {
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      return {
        user,
        isValid: await user.validatePassword(userPassword)
      };
    }) //if user exists, check password 
    .then(result => {
      //console.log(result);
      if (!result.isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username or password'
        });
      }
      //if password correct, create auth token 
      const authToken = createAuthToken(result.user.toClient());
      res.status(200).json({
        meta: 'success',
        userId: result.user._id,
        authToken
      });
    })
    .catch(err => {
      if (err.reason === 'LoginError') {
        return res.status(401).json({ message: err.message });
      }
      console.log(err.stack);
      res.status(500).json({ message: err.message });
    });
});

router.post(
  '/refresh',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
  }
);

module.exports = router;