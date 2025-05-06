// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cors = require("cors");
require("dotenv").config();

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // 1) spin up in-memory MongoDB
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // 2) seed user1
  const User = require("./models/User");
  if (!(await User.findOne({ username: "user1" }))) {
    await new User({ username: "user1", role: "user" }).save();
  }

  // 3) mount routers
  app.use("/admin", require("./routes/admin"));
  app.use("/api/users", require("./routes/user"));
  app.use("/api/listings", require("./routes/listings"));
  app.use("/api/reservations", require("./routes/reservations"));

  // 4) health-check
  app.get("/", (_, res) => res.send("OK"));

  // only listen when running locally
  if (!process.env.NETLIFY) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  }

  return app;
}

// start the server
startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

module.exports = startServer;
