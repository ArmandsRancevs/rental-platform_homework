// backend/routes/products.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /api/products → list all products
router.get('/', async (req, res) => {
  const all = await Product.find();
  res.json(all);
});

// POST /api/products → create a new product
router.post('/', async (req, res) => {
  const created = await new Product(req.body).save();
  res.status(201).json(created);
});

// PUT /api/products/:id → replace an existing product
router.put('/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
});

// DELETE /api/products/:id → delete a product
router.delete('/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// DELETE /api/products → delete all products
router.delete('/', async (req, res) => {
  await Product.deleteMany({});
  res.sendStatus(204);
});

module.exports = router;
