// backend/models/Listing.js
const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  pricePerNight: { type: Number, required: true },
  availability: { type: [availabilitySchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
