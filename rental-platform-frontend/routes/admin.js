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
  return new Date(Date.UTC(year, month, day));
}

// Helper to normalize availability intervals
function normalizeAvailability(availability) {
  return availability.map(interval => {
    const start = toUTCDate(interval.startDate);
    const end = toUTCDate(interval.endDate);
    end.setUTCDate(end.getUTCDate() + 1); // end exclusive
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      quantity: interval.quantity
    };
  });
}

// POST /admin/listings
router.post('/listings', async (req, res) => {
  try {
    const { title, description, location, pricePerNight, availability } = req.body;
    if (
      !title ||
      !description ||
      !location ||
      typeof pricePerNight !== 'number' ||
      !Array.isArray(availability) ||
      availability.some(a => typeof a.quantity !== 'number' || a.quantity < 1)
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required fields or invalid availability format (quantity must be a number ≥1)' });
    }
    const normalized = normalizeAvailability(availability);
    console.log('Creating listing with availability:', normalized);
    const listing = new Listing({ title, description, location, pricePerNight, availability: normalized, createdAt: new Date() });
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

// PUT /admin/listings/:id
router.put('/listings/:id', async (req, res) => {
  try {
    const { title, description, location, pricePerNight, availability } = req.body;
    if (
      !title ||
      !description ||
      !location ||
      typeof pricePerNight !== 'number' ||
      !Array.isArray(availability) ||
      availability.some(a => typeof a.quantity !== 'number' || a.quantity < 1)
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required fields or invalid availability format (quantity must be a number ≥1)' });
    }
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    const normalized = normalizeAvailability(availability);
    listing.title = title;
    listing.description = description;
    listing.location = location;
    listing.pricePerNight = pricePerNight;
    listing.availability = normalized;
    await listing.save();
    console.log('Listing updated:', listing);
    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /admin/listings/:id
router.delete('/listings/:id', async (req, res) => {
  try {
    const deleted = await Listing.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    console.log('Listing deleted:', req.params.id);
    res.sendStatus(204);
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
