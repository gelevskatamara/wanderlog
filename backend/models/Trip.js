const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Trip title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true,
    match: [/^[a-zA-Z\s]+$/, 'Destination can only contain letters and spaces'],
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required'],
    validate: {
      validator: function (val) {
        if (!this.startDate) return true;
        return new Date(val) >= new Date(this.startDate);
      },
      message: 'End date must be on or after start date',
    },
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: '',
  },
  status: {
    type: String,
    enum: ['planned', 'ongoing', 'completed'],
    default: 'planned',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  guests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trip', tripSchema);
