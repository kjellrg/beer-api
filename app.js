require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { signinHandler } = require('./sessionhandlers')

// mongoDB server
var MONGODB_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_SERVER}/beers`;
mongoose
  .connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch((error) => console.error(error));

var corsOptions = {
  origin: process.env.ORIGINS,
  methods: ["GET", "PATCH"],
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middleware
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))

// routes
const beersRoute = require("./routes/api/v1/beers");
app.use("/api/v1/beers", beersRoute);
app.post("/login", signinHandler)
// listen

module.exports = app;
