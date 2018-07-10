// router for the root path (/)

const express = require("express");
const apiMainRouter = express.Router();
const User = require("../model/userModel");

// session stuff
var session = require('express-session');

apiMainRouter.use(session({
    cookieName: 'session',
    secret: 'insecure_demo_secret',   // this will be updated, just bad for the demo
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));

// function for creating variables on a dashboard

// main root for homepage
apiMainRouter.get("/", (req, res, next) => {
    // TODO: if session take user to dashboard, if not make them sign in/sign up

});

// get route for sign up page
apiMainRouter.get("/sign_up", (req, res, next) => {
    res.render("sign_up");
});

// post route for sign up page
apiMainRouter.post("/sign_up", (req, res, next) => {
    /**
     * doubles as showing the page and also sending the new user object
     * TODO: make sure that the new user obj doesn't have the password sent back
     */
    var newUser = new User(req.body);
    // set everything for the new user
    newUser.admin = false;
    newUser.wins = 0;
    newUser.losses = 0;
    newUser.created_at = Date.now();
    // save the user in the database
    newUser
        .save()
        .then(item => {
            console.log("new user " + newUser.username + " created");

            res.status.send(newUser);
        })
        .catch(err => {
            res.render("sign_up_error");
            //res.status(400).send("unable to save to database!");

        });
});

// get route for the sign in page
apiMainRouter.get("/sign_in", (req, res, next) => {
    res.render("sign_in");
});

// post route for signign in
apiMainRouter.post('/sign_in', function (req, res, next) {
    User.findOne({ username: req.body.username, password: req.body.password }, function (err, user) {
        if (!user) {
            res.render('sign_in_error', { error: 'Invalid email or password.' });
        } else {
            if (req.body.password === user.password) {
                // sets a cookie with the user's info
                req.session.user = user;
                res.redirect('/dashboard');
            } else {
                res.render('sign_in_error', { error: 'Invalid email or password.' });
            }
        }
    });
});

// get route for the user dashboard
apiMainRouter.get('/dashboard', function (req, res) {
    if (req.session && req.session.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        User.findOne({
            username: req.session.user.username,
            password: req.session.user.password
        }, function (err, user) {
            if (!user) {
                // if the user isn't found in the DB, reset the session info and
                // redirect the user to the login page
                req.session.reset();
                res.redirect('/sign_in');
            } else {
                // expose the user to the template
                res.locals.user = user;

                // get the variabls for the dashboard page
                var username = req.session.user.username;
                var wins = req.session.user.wins;
                var losses = req.session.user.losses;
                var wl_ratio = (wins / losses); // win loss ratio

                // render the dashboard page
                res.render('dashboard', {
                    username: username,
                    wins: wins,
                    losses: losses,
                    wl_ratio: wl_ratio
                });
            }
        });
    } else {
        res.redirect('/sign_in');
    }
});

module.exports = apiMainRouter;
