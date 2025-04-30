// server.js
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// -- your in-memory Mongo startup here (connect once on require) --

// your /admin and /api routes here

if (process.env.NETLIFY) {
  // when running in Netlify Functions we'll never hit this branch
} else {
  // only call listen() when running locally
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = app;

