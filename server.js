// server.js
const express = require("express");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const cors = require("cors");
require("dotenv").config();

const app = express();

// --- middleware ---
app.use(cors());
app.use(express.json());

// --- spin up in-memory Mongo and connect Mongoose ---
;(async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🗄️ Connected to in-memory MongoDB");
  } catch (err) {
    console.error("❌ Failed to start in-memory MongoDB:", err);
    process.exit(1);
  }
})();

// --- mount your routers ---
const adminRoutes = require("./routes/admin");
const userRoutes  = require("./routes/user");

app.use("/admin", adminRoutes);
app.use("/api",   userRoutes);

// --- a simple health-check (optional) ---
app.get("/", (req, res) => {
  res.send("Rental platform API is up.");
});

// --- only listen when running locally (not in Netlify Functions) ---
if (!process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`);
  });
}

// --- export for Netlify Functions / serverless-http ---
module.exports = app;
