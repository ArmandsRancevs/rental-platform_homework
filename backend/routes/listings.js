// backend/routes/listings.js
const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

// GET /api/listings → list all listings
router.get('/', async (req, res) => {
  const all = await Listing.find();
  res.json(all);
});

// POST /api/listings → create a new listing
router.post('/', async (req, res) => {
  const created = await new Listing(req.body).save();
  res.status(201).json(created);
});

// PUT /api/listings/:id → replace an existing listing
router.put('/:id', async (req, res) => {
  const updated = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Listing not found' });
  res.json(updated);
});

// DELETE /api/listings/:id → delete a listing
router.delete('/:id', async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// DELETE /api/listings → delete all listings
router.delete('/', async (req, res) => {
  await Listing.deleteMany({});
  res.sendStatus(204);
});

module.exports = router;
