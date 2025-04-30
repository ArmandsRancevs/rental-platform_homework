// server.js
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// 1) spin up in-memory Mongo
const mongoServer = await MongoMemoryServer.create();
await mongoose.connect(mongoServer.getUri(), {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 2) seed user1
const User = require("./models/User");
if (!(await User.findOne({ username: "user1" }))) {
  await new User({ username: "user1", role: "user" }).save();
}

// 3) mount your routers
app.use("/admin", require("./routes/admin"));
app.use("/api", require("./routes/user"));

// 4) health-check
app.get("/", (_, res) => res.send("OK"));

// only listen when running locally
if (!process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));
}

module.exports = app;
