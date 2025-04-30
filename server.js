const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// immediately start your in-memory Mongo and connect Mongoose
(async function initDB() {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('🗄️  Connected to in-memory MongoDB');
})().catch(err => {
  console.error('❌ Failed to start in-memory MongoDB', err);
});

// mount your routes _after_ mongoose is wired up
app.use('/admin', require('./routes/admin'));
app.use('/api',   require('./routes/user'));

// fallback root
app.get('/', (_,res) => res.send('Rental-platform API up and running.'));

// only listen if _not_ in Netlify Functions
if (!process.env.NETLIFY) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Listening on ${PORT}`));
}

module.exports = app;
