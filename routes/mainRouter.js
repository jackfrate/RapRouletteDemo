// router for the root path (/)

const express = require("express");
const mainRouter = express.Router();
const User = require("../model/userModel");

// session stuff
var session = require('express-session');
mainRouter.use(session({
  cookieName: 'session',
  secret: 'insecure_demo_secret',   // this will be updated, just bad for the demo
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));

// main root for homepage
mainRouter.get("/", (req, res, next) => {
  // TODO: if session take user to dashboard, if not make them sign in/sign up
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
        res.redirect('/index');
      } else {
        res.redirect('/dashboard');
      }
    });
  } else {
    res.redirect('/index');
  }
});

// get route for sign up page
mainRouter.get("/sign_up", (req, res, next) => {
  res.render("sign_up");
});

// post route for sign up page
mainRouter.post("/sign_up", (req, res, next) => {
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
      res.render("sign_up_success");
      res.send(newUser);
    })
    .catch(err => {
      res.render("sign_up_error");
      //res.status(400).send("unable to save to database!");

    });
});

// get route for the sign in page
mainRouter.get("/sign_in", (req, res, next) => {
  res.render("sign_in");
});

// post route for signign in
mainRouter.post('/sign_in', function (req, res, next) {
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
mainRouter.get('/dashboard', function (req, res) {
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

        // object for the user
        let newUser = {
          username: req.session.user.username,
          wins: req.session.user.wins,
          losses: req.session.user.losses,
          wl_ratio: (this.wins / this.losses)
        }
        // render the dashboard page
        res.render('dashboard', {
          username: newUser.username,
          wins: newUser.wins,
          losses: newUser.losses,
          wl_ratio: newUser.wl_ratio
        });
      }
    });
  } else {
    res.redirect('/sign_in');
  }
});

module.exports = mainRouter;
