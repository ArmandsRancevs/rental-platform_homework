// start.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('./server');

(async () => {
  // spin up in‐memory mongo
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri(), {
    useNewUrlParser:    true,
    useUnifiedTopology: true,
  });

  // ensure default user1 exists
  const User = require('./models/User');
  if (!(await User.findOne({ username: 'user1' }))) {
    await new User({ username: 'user1', role: 'user' }).save();
    console.log('Lietotājs "user1" izveidots');
  }

  // start HTTP server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Serveris darbojas uz porta ${PORT}`);
  });
})().catch(err => console.error(err));
