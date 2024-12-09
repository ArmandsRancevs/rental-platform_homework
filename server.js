// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URL = 'mongodb://localhost:27017/rental_platform';
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check connection
const db = mongoose.connection;
db.on('error', (error) => console.error('Savienojuma kļūda:', error));
db.once('open', async () => {
  console.log('Savienojums ar MongoDB izveidots');

  // Check for user1 existence
  const User = require('./models/User');

  try {
    const user1 = await User.findOne({ username: 'user1' });
    if (!user1) {
      const newUser = new User({
        username: 'user1',
        role: 'user',
        createdAt: new Date(),
      });
      await newUser.save();
      console.log('Lietotājs "user1" izveidots');
    } else {
      console.log('Lietotājs "user1" jau pastāv');
    }
  } catch (error) {
    console.error('Kļūda, meklējot vai veidojot "user1":', error);
  }
});

// Routes
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

app.use('/admin', adminRoutes);
app.use('/api', userRoutes);

// Home route
app.get('/', (req, res) => {
  res.send('Nomas pakalpojumu platformas API');
});

// Handle 404 for unmatched routes
app.use((req, res) => {
  console.warn(`Neatpazīta maršruta pieprasījums: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: 'Maršruts nav atrasts' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveris darbojas uz porta ${PORT}`);
});
