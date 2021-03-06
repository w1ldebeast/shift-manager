// config/passport.js

// load all the things we need
var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var {User} = require('../app/models/user');

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
     //   usernameField : 'email',
     //   passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // asynchronous
        // User.findOne wont fire unless data is sent back
        //process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  username }).then((user) => {
				if (user) {
					return done(null, false);
				} else {
					console.log(username);
					console.log(password);

					var newUser = new User(); 
				
					newUser.email = username;
					newUser.password = newUser.generateHash(password);	
					newUser.save().then((user) => {
						return done(null, user);
					}, (e) => {
						return done(e);
					});
				}
			}, (e) => {
				return done(e);
		});
    }));


	
    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
      //  usernameField : 'email',
      //  passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'email' :  username }).then((user) => {
		if (!user) {
			return done(null, false);
		} else if (!user.validPassword(password)) {
			return done(null, false); 
		} else {
			return done(null, user);
		}
	}, (e) => {
		return done(e);
	});




    }));

};








