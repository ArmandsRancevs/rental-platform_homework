// backend/routes/user.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/user1 → return the seeded user1
router.get('/user1', async (req, res) => {
  const user = await User.findOne({ username: 'user1' });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

module.exports = router;
