const router = require("express").Router();
const User = require('../models/User');
const passport = require('passport');

router.get('/login', passport.authenticate('github'));

// this the route that we registered on the github api when we created the app
router.get('/auth/github/callback',
	passport.authenticate('github', {
		successRedirect: '/',
		failureRedirect: '/login'
	}));

router.get('/logout', (req, res, next) => {
	console.log('user BEFORE log out: ' + req.user)
	req.logout();
	console.log('user AFTER log out: ' + req.user)
	res.redirect('/');
});

module.exports = router;