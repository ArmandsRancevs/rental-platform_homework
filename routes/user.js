// routes/user.js

const express = require('express');
const router = express.Router();

const Listing     = require('../models/Listing');
const Reservation = require('../models/Reservation');
const User        = require('../models/User');

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
    if (!listingId || !userId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Parse dates
    const start = utcMidnight(new Date(startDate));
    const end   = utcMidnight(new Date(endDate));

    // Find listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Sludinājums nav atrasts' });
    }

    // Build day-by-day intervals
    const intervals = listing.availability.map(p => ({
      start: new Date(p.startDate),
      end:   new Date(p.endDate),
      quantity: p.quantity
    }));

    // Check that every day is covered and has quantity > 0
    let current = new Date(start);
    while (current <= end) {
      const cover = intervals.find(i => current >= i.start && current < i.end);
      if (!cover || cover.quantity < 1) {
        return res.status(400).json({ message: 'Izvēlētie datumi vai daudzums nav pieejami' });
      }
      current.setUTCDate(current.getUTCDate() + 1);
    }

    // Create reservation
    const totalPrice = calculateTotalPrice(listing.pricePerNight, start, end);
    const reservation = new Reservation({ listing: listingId, user: userId, startDate: start, endDate: end, totalPrice });
    await reservation.save();

    // Decrement quantity for the affected interval(s)
    // (We'll pull fresh doc to update)
    for (let i = 0; i < listing.availability.length; i++) {
      const period = listing.availability[i];
      const pStart = new Date(period.startDate);
      const pEnd   = new Date(period.endDate);
      // If the reservation range overlaps this period, decrement
      if (start < pEnd && end >= pStart) {
        listing.availability[i].quantity = period.quantity - 1;
      }
    }
    await listing.save();

    res.status(201).json(reservation);
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ message: err.message });
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

// Helpers

function utcMidnight(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function calculateTotalPrice(pricePerNight, startDate, endDate) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.ceil((endDate - startDate + 1 * msPerDay) / msPerDay);
  return pricePerNight * diffDays;
}

module.exports = router;
