const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
//mongooose for database
const mongoose = require('mongoose');

//Load User Model for database
require('../models/user');
const User = mongoose.model('users');

//  / -> /users because we are in users route file

//Login User route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//Login Form Post
router.post('/login',  (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/data/1',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Register User route
router.get('/register', (req, res) => {
  res.render('users/register');
});

//Register Form Post
router.post('/register',  (req, res) => {
  let errors = [];
  if (req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match'});
  }
  if (req.body.password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 chars'});
  }

  //If error we keep form full of content by user
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email, 
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => {
              req.flash('success_msg', 'You are now registered');
              res.redirect('/users/login');
            })
            .catch(err => {
              console.log(err);
              return;
            })
          });   
        });
      }
    });
  }
});

//Logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;


