// routes/admin.js

const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');

// Extract year/month/day from date and construct a UTC midnight date
function toUTCDate(dateInput) {
  const d = new Date(dateInput);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const day = d.getUTCDate();
  // Create a new date at midnight UTC
  return new Date(Date.UTC(year, month, day));
}

// POST /admin/listings
router.post('/listings', async (req, res) => {
  try {
    const { title, description, location, pricePerNight, availability } = req.body;

    if (!title || !description || !location || typeof pricePerNight !== 'number' || !Array.isArray(availability)) {
      return res.status(400).json({ message: 'Missing required fields or invalid availability format' });
    }

    // Normalize intervals so each covers full days:
    // If we want the listing to be available through the end of the 'endDate' day,
    // we add one extra day to the end date, making intervals [start, end) with end exclusive.
    const normalizedAvailability = availability.map(interval => {
      const startRaw = new Date(interval.startDate);
      const endRaw = new Date(interval.endDate);

      // Convert to midnight UTC
      const start = toUTCDate(startRaw);
      const end = toUTCDate(endRaw);

      // Add one extra day so that if end date was intended to cover the entire end day,
      // now it becomes exclusive the next midnight. For example:
      // If user intended coverage through 13.12.2024 inclusive, storing end as 14th midnight.
      end.setUTCDate(end.getUTCDate() + 1);

      return {
        startDate: start.toISOString(),
        endDate: end.toISOString()
      };
    });

    // Debug logging the normalized intervals
    console.log('Creating listing with availability:', normalizedAvailability);

    const listingData = {
      title,
      description,
      location,
      pricePerNight,
      availability: normalizedAvailability,
      createdAt: new Date()
    };

    const listing = new Listing(listingData);
    await listing.save();

    console.log('Listing created:', listing);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /admin/listings
router.get('/listings', async (req, res) => {
  try {
    const listings = await Listing.find();
    console.log('Returning listings:', listings);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
