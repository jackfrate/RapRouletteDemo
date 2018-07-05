/**
 * Routes to the root
 * I know its just to the main route but I wanted to keep them in a separate file
 * for cleaner code
 */

const express = require("express");
const mainRouter = express.Router();
const User = require("../model/userModel");

// files are rendered from the views folder

// main root for homepage
mainRouter.get("/", (req, res, next) => {
  res.render("index");
});

// get route for sign up page
mainRouter.get("/sign_up", (req, res, next) => {
  res.render("sign_up");
});

// post route for sign up page
mainRouter.post("/sign_up", (req, res, next) => {
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
    })
    .catch(err => {
      res.status(400).send("unable to save to database!");
    });
});

// get route for the sign in page
mainRouter.get("/sign_in", (req, res, next) => {
  res.render("sign_in");
});

// method for signing in
// SHOULD THIS return a json object or an html page? probably json
// START BACK UP HERE

module.exports = mainRouter;
