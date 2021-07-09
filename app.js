// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv/config");

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// session configuration
const session = require('express-session');
const MongoStore = require('connect-mongo');
const DB_URL = process.env.MONGODB_URI;

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		// for how long is a user automatically logged in 
		cookie: { maxAge: 1000 * 60 * 60 * 24 },
		saveUninitialized: false,
		resave: true,
		store: MongoStore.create({
			mongoUrl: DB_URL
		})
	})
)
// end of session configuration

// passport config
const User = require('./models/User');
const passport = require('passport');

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser((id, done) => {
	User.findById(id)
		.then(userFromDB => {
			done(null, userFromDB);
		})
		.catch(err => {
			done(err);
		})
})

app.use(passport.initialize());
app.use(passport.session());
// end of passport config


// passport - github strategy
const GithubStrategy = require('passport-github').Strategy;

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET,
			callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
		},
		(accessToken, refreshToken, profile, done) => {
			// console.log(profile);
			// authentication on github passed and we need to check if we have 
			// a user with that github id already in the database - if not we create it
			User.findOne({ githubId: profile.id })
				.then(userFromDB => {
					if (userFromDB !== null) {
						// pass the user to passport so it can be serialized and it's id 
						// is put into the session
						done(null, userFromDB);
					} else {
						// we create that user
						User.create({ githubId: profile.id, username: profile.username, avatar: profile._json.avatar_url })
							.then(userFromDB => {
								done(null, userFromDB);
							})
					}
				})
				.catch(err => {
					done(err);
				})
		}
	)
)
// end of passport - github strategy

// Start handling routes here
const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth");
app.use("/", auth);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;