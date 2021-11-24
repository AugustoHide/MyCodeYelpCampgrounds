const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

const users = require('../controllers/users');
const user = require('../models/user');

router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register))

// router.get('/register', users.renderRegister);

// router.post('/register', catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

// router.get('/login', users.renderLogin);

// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout)

module.exports = router;