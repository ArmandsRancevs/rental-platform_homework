// backend/routes/admin.js
const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// GET /admin/products → list all products
router.get('/products', async (req, res) => {
  const all = await Product.find();
  res.json(all);
});

// POST /admin/products → create a new product
router.post('/products', async (req, res) => {
  const created = await new Product(req.body).save();
  res.status(201).json(created);
});

// PUT /admin/products/:id → replace an existing product
router.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
});

// DELETE /admin/products/:id → delete a product
router.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// DELETE /admin/products → delete all products
router.delete('/products', async (req, res) => {
  await Product.deleteMany({});
  res.sendStatus(204);
});

module.exports = router;
