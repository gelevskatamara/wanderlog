const mongoose = require('mongoose');

const tripPhotoSchema = new mongoose.Schema({
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  url: { type: String, required: true },
  caption: { type: String, maxlength: 200, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TripPhoto', tripPhotoSchema);
