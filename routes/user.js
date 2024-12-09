// routes/user.js

const express = require('express');
const router = express.Router();

const Listing = require('../models/Listing');
const Reservation = require('../models/Reservation');
const User = require('../models/User');

// GET /api/listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    res.json(listings);
  } catch (err) {
    console.error('Error fetching listings:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reservations
// Expects: { listing: listingId, user: userId, startDate: ISOString, endDate: ISOString }
router.post('/reservations', async (req, res) => {
  try {
    const { listing: listingId, user: userId, startDate, endDate } = req.body;

    // Validate input
    if (!listingId || !userId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check listing existence
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Sludinājums nav atrasts' });
    }

    // Check availability using day-by-day logic
    const isAvailable = checkAvailability(listing.availability, start, end);
    if (!isAvailable) {
      return res.status(400).json({ message: 'Izvēlētie datumi nav pieejami' });
    }

    // Create new reservation
    const totalPrice = calculateTotalPrice(listing.pricePerNight, start, end);
    const reservation = new Reservation({
      listing: listingId,
      user: userId,
      startDate: start,
      endDate: end,
      totalPrice
    });
    await reservation.save();

    res.status(201).json(reservation);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(400).json({ message: err.message });
  }
});

// GET /api/user1 - retrieve user1 data
router.get('/user1', async (req, res) => {
  try {
    const user1 = await User.findOne({ username: 'user1' });
    res.json(user1);
  } catch (err) {
    console.error('Error fetching user1:', err);
    res.status(500).json({ message: err.message });
  }
});

// Day-by-day availability check
function checkAvailability(availabilityPeriods, startDate, endDate) {
  const intervals = parseIntervals(availabilityPeriods);

  const startUTC = utcMidnight(startDate);
  const endUTC = utcMidnight(endDate);

  let current = new Date(startUTC);
  while (current <= endUTC) {
    if (!isDayCovered(current, intervals)) {
      return false;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return true;
}

// Parse availability intervals from DB as [start, end) intervals
function parseIntervals(intervals) {
  return intervals.map(p => ({
    start: new Date(p.startDate),
    end: new Date(p.endDate) // end is exclusive
  }));
}

// Check if a specific day is covered by any interval
function isDayCovered(day, intervals) {
  return intervals.some(interval => day >= interval.start && day < interval.end);
}

// Ensure we get midnight UTC date
function utcMidnight(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

// Calculate total price based on days
function calculateTotalPrice(pricePerNight, startDate, endDate) {
  const timeDiff = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return pricePerNight * diffDays;
}

module.exports = router;
