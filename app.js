// app.js
const express = require("express");
const app = express();
const port = 3000;

// for keys and tokens
const fs = require("fs");
// Define to JSON type
var keys = JSON.parse(fs.readFileSync("keys.json"));

// express stuff with some view engine in there
app.use(express.static("public"));
app.set("view engine", "ejs");

// mongoose stuff
// const userModel = require("./model/userModel");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
  keys.mongo, { useNewUrlParser: true }
);

// body parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// routers
const mainRouter = require("./routes/mainRouter");
app.use("/", mainRouter);

// routers for the api
// const apiMainRouter = require("./routes/apiMainRouter");
// app.use("/api", apiMainRouter);

// listen
app.listen(port, function () {
  console.log("RR DEMO ONLINE");
  console.log(keys);
});
