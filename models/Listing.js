// models/Listing.js

const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
});

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  pricePerNight: Number,
  availability: [availabilitySchema], // Pieejamības periodu masīvs
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Listing', listingSchema);
