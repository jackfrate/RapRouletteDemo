// server.js

const express = require("express");
const app = express();
const port = 3000;

// express stuff with some view engine in there
app.use(express.static("public"));
app.set("view engine", "ejs");

// mongoose stuff
const userModel = require("./model/userModel");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://rr:ReallyGoodDemoPassword1@ds018248.mlab.com:18248/rr-demo",
  { useNewUrlParser: true }
);

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routers
const mainRouter = require("./routes/mainRouter");
app.use("/", mainRouter);

// listen
app.listen(port, function () {
  console.log("RR DEMO ONLINE");
});
