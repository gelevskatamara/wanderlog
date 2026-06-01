const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Trip = require('../models/Trip');
const Country = require('../models/Country');
const Review = require('../models/Review');
const Notification = require('../models/Notification');

// /db — dev-only database reset and seed page
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WanderLog DB Tools</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 60px auto; padding: 20px; background: #f8f7ff; }
        h1 { color: #636BAB; }
        .btn { display: inline-block; padding: 12px 24px; border-radius: 50px; font-weight: bold;
               cursor: pointer; border: none; font-size: 14px; margin: 8px 4px; text-decoration: none; }
        .danger { background: #ef4444; color: white; }
        .success { background: #636BAB; color: white; }
        .warning { color: #b45309; background: #fef3c7; padding: 12px; border-radius: 8px; margin: 16px 0; }
      </style>
    </head>
    <body>
      <h1>🌍 WanderLog — DB Tools</h1>
      <div class="warning">⚠️ This page is for development use only. Do not expose in production.</div>
      <p>
        <a href="/db/seed" class="btn success">🌱 Seed Initial Data</a>
        <a href="/db/reset" class="btn danger">🗑 Reset All Data</a>
      </p>
      <p style="color:#64748b; font-size:13px;">
        Seed creates: 1 admin, 2 users, sample trips, reviews, and notifications.<br/>
        Reset deletes all documents from all collections.
      </p>
    </body>
    </html>
  `);
});

router.get('/reset', async (req, res) => {
  try {
    await Promise.all([
      User.deleteMany({}),
      Trip.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    res.json({ success: true, message: 'All data deleted (Countries kept)' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/seed', async (req, res) => {
  try {
    // Clear first
    await Promise.all([
      User.deleteMany({}),
      Trip.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
    ]);

    // Create users
    const admin = await User.create({ name: 'Admin User', email: 'admin@wanderlog.com', password: 'admin123', role: 'admin' });
    const user1 = await User.create({ name: 'Alex Johnson', email: 'alex@wanderlog.com', password: 'user123', role: 'user' });
    const user2 = await User.create({ name: 'Maria Smith', email: 'maria@wanderlog.com', password: 'user123', role: 'user' });

    // Create trips
    const trip1 = await Trip.create({ title: 'Tokyo & Kyoto Adventure', destination: 'Japan', startDate: new Date('2025-03-15'), endDate: new Date('2025-03-28'), description: 'Cherry blossoms and neon lights.', status: 'planned', userId: user1._id });
    const trip2 = await Trip.create({ title: 'Greek Islands Hopping', destination: 'Greece', startDate: new Date('2024-08-10'), endDate: new Date('2024-08-22'), description: 'Santorini, Mykonos, and Crete.', status: 'completed', userId: user1._id });
    const trip3 = await Trip.create({ title: 'Italian Food & Culture', destination: 'Italy', startDate: new Date('2024-06-05'), endDate: new Date('2024-06-15'), description: 'Rome, Florence, and Venice.', status: 'completed', userId: user2._id });
    const trip4 = await Trip.create({ title: 'Lisbon Long Weekend', destination: 'Portugal', startDate: new Date('2025-05-02'), endDate: new Date('2025-05-06'), description: 'Pasteis de nata and fado music.', status: 'planned', userId: user2._id });

    // Create reviews
    await Review.create({ rating: 5, comment: 'Absolutely breathtaking. Greece exceeded every expectation!', userId: user1._id, tripId: trip2._id });
    await Review.create({ rating: 5, comment: 'Rome is a living museum. The pasta alone was worth the flight.', userId: user2._id, tripId: trip3._id });

    // Create notifications
    await Notification.create({ userId: user1._id, message: 'Welcome to WanderLog, Alex!', type: 'welcome' });
    await Notification.create({ userId: user1._id, message: 'Your trip "Tokyo & Kyoto Adventure" has been created!', type: 'trip_created' });
    await Notification.create({ userId: user2._id, message: 'Welcome to WanderLog, Maria!', type: 'welcome' });

    res.json({
      success: true,
      message: 'Database seeded successfully',
      credentials: {
        admin: { email: 'admin@wanderlog.com', password: 'admin@1234' },
        user1: { email: 'alex@wanderlog.com', password: 'user@1234' },
        user2: { email: 'maria@wanderlog.com', password: 'user@1234' },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/fix-trips', async (req, res) => {
  try {
    const Trip = require('../models/Trip');
    const result = await Trip.updateMany(
      { guests: { $exists: false } },
      { $set: { guests: [] } }
    );
    res.json({ success: true, message: `Fixed ${result.modifiedCount} trips` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


router.get('/make-admin', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOneAndUpdate(
      { email: 'admin@wanderlog.com' },
      { role: 'admin' },
      { new: true }
    );
    res.json({ success: true, message: `${user.name} is now admin` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
