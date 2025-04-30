// models/Listing.js

const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  }
});

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: [availabilitySchema],
    validate: {
      validator: function(arr) {
        return arr.length > 0;
      },
      message: 'At least one availability period is required'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Listing', listingSchema);
