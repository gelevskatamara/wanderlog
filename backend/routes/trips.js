const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');
const { sendTripNotification } = require('../config/email');

/**
 * @swagger
 * tags:
 *   name: Trips
 *   description: Trip management
 */

/**
 * @swagger
 * /trips:
 *   get:
 *     summary: Get all trips for the logged-in user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, ongoing, completed]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of trips
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };

    const trips = await Trip.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /trips/all:
 *   get:
 *     summary: Get all trips (admin only)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All trips in the system
 *       403:
 *         description: Not authorised
 */
router.get('/all', protect, authorize('admin'), async (req, res, next) => {
  try {
    const trips = await Trip.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, count: trips.length, trips });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /trips/stats:
 *   get:
 *     summary: Get trip statistics for logged-in user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trip statistics
 */
router.get('/stats', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;
    const [total, planned, ongoing, completed] = await Promise.all([
      Trip.countDocuments({ userId }),
      Trip.countDocuments({ userId, status: 'planned' }),
      Trip.countDocuments({ userId, status: 'ongoing' }),
      Trip.countDocuments({ userId, status: 'completed' }),
    ]);

    // Group by destination for region chart
    const byDestination = await Trip.aggregate([
      { $match: { userId } },
      { $group: { _id: '$destination', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, stats: { total, planned, ongoing, completed, byDestination } });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /trips/{id}:
 *   get:
 *     summary: Get a single trip by ID
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip data
 *       404:
 *         description: Trip not found
 */
router.get('/:id', protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userId', 'name email');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    // Only owner or admin can view
    if (trip.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    res.json({ success: true, trip });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Trip created
 */
router.post('/', protect, authorize('user', 'admin'), async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, userId: req.user._id });

    await Notification.create({
      userId: req.user._id,
      message: `Your trip "${trip.title}" has been created!`,
      type: 'trip_created',
    });

    sendTripNotification(req.user.email, req.user.name, trip.title, 'created');

    res.status(201).json({ success: true, trip });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /trips/{id}:
 *   put:
 *     summary: Update a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       200:
 *         description: Trip updated
 *       403:
 *         description: Not authorised
 *       404:
 *         description: Trip not found
 */
router.put('/:id', protect, authorize('user', 'admin'), async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    trip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    await Notification.create({
      userId: req.user._id,
      message: `Your trip "${trip.title}" has been updated.`,
      type: 'trip_updated',
    });

    res.json({ success: true, trip });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Trip deleted
 *       403:
 *         description: Not authorised
 *       404:
 *         description: Trip not found
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
