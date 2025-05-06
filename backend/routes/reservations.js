// backend/routes/reservations.js
const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

// POST /api/reservations → create a new reservation
router.post('/', async (req, res) => {
  try {
    const created = await new Reservation(req.body).save();
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
