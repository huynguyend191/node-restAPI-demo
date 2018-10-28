const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.user_signup = (req, res, next) => {
  User.find({email: req.body.email}).exec()
  .then(user => {
    if (user.length >= 1) {
      return  res.status(409).json({
        message: 'Email already exists'
      })
    } else {
      bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash
          });
          user.save().then(result => {
            console.log(result);
            res.status(201).json({
              message: 'User created'
            });
          }).catch(error => {
            console.log(error);
            res.status(500).json({
              error: error
            });
          });
        }
      });
    }
  });
}

exports.user_delete = (req, res, next) => {
  const id = req.params.userId;
  User.deleteOne({_id: id}).exec()
  .then(result => {
      res.status(200).json({
        message: 'User deleted'
      })
  }).catch(error => {
    res.status(500).json({
      error
    });
  });
}

exports.user_login = (req, res, next) => {
  User.find({email: req.body.username}).exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: 'Authentication failed'
      });
    } else {
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Authentication failed'
          });
        } 
        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id
          }, process.env.JWT_KEY,
          {
            expiresIn: "1h",
          });
          
          res.cookie('userCookie', token, {
            expires: new Date(Date.now() + 30*60*1000),
            overwrite: true
          });
          
          return res.status(200).json({
            message: 'Authentication successful',
            token
          });
        }
        res.status(401).json({
          message: 'Authentication failed'
        });
      })
    }
  }).catch(error => {
    res.status(500).json({
      error
    });
  })
}