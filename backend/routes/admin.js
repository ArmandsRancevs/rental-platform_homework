// backend/routes/admin.js
const express = require('express');
const Listing = require('../models/Listing');
const router = express.Router();

// GET /admin/listings → list all listings
router.get('/listings', async (req, res) => {
  const all = await Listing.find();
  res.json(all);
});

// POST /admin/listings → create a new listing
router.post('/listings', async (req, res) => {
  const created = await new Listing(req.body).save();
  res.status(201).json(created);
});

// PUT /admin/listings/:id → replace an existing listing
router.put('/listings/:id', async (req, res) => {
  const updated = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Listing not found' });
  res.json(updated);
});

// DELETE /admin/listings/:id → delete a listing
router.delete('/listings/:id', async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// DELETE /admin/listings → delete all listings
router.delete('/listings', async (req, res) => {
  await Listing.deleteMany({});
  res.sendStatus(204);
});

module.exports = router;
