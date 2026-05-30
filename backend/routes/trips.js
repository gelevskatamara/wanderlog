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
    const ownFilter = { userId: req.user._id };
    if (req.query.status) ownFilter.status = req.query.status;
    if (req.query.search) ownFilter.title = { $regex: req.query.search, $options: 'i' };

    const guestFilter = { guests: { $in: [req.user._id] } };
    if (req.query.status) guestFilter.status = req.query.status;
    if (req.query.search) guestFilter.title = { $regex: req.query.search, $options: 'i' };

    const [ownTrips, guestTrips] = await Promise.all([
      Trip.find(ownFilter).sort({ createdAt: -1 }),
      Trip.find(guestFilter).populate('userId', 'name').sort({ createdAt: -1 }),
    ]);

    const markedGuestTrips = guestTrips.map(t => ({ ...t.toObject(), isGuestTrip: true }));
    const trips = [...ownTrips, ...markedGuestTrips].sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    );

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
    const ownerId = trip.userId._id ? trip.userId._id.toString() : trip.userId.toString();
    const isOwner = ownerId === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isGuest = trip.guests && trip.guests.map(g => g.toString()).includes(req.user._id.toString());
    if (!isOwner && !isAdmin && !isGuest)
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

/**
 * @swagger
 * /trips/{id}/invite:
 *   post:
 *     summary: Invite a user as guest to view a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Guest invited successfully
 */
router.post("/:id/invite", protect, authorize("user", "admin"), async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    const User = require("../models/User");
    const invitee = await User.findOne({ email: req.body.email });
    if (!invitee) return res.status(404).json({ success: false, message: "No user found with that email" });

    if (invitee._id.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: "You cannot invite yourself" });

    if (trip.guests.map(g => g.toString()).includes(invitee._id.toString()))
      return res.status(400).json({ success: false, message: "This user is already a guest on this trip" });

    trip.guests.push(invitee._id);
    await trip.save();

    const Notification = require("../models/Notification");
    await Notification.create({
      userId: invitee._id,
      message: `You have been invited to view the trip "${trip.title}" by ${req.user.name}.`,
      type: "trip_created",
    });

    res.json({ success: true, message: `${invitee.name} has been invited as a guest` });
  } catch (err) { next(err); }
});

router.get("/:id/guests", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("guests", "name email avatar");
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    const ownerId = trip.userId.toString();
    const isOwner = ownerId === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ success: false, message: "Not authorised" });

    res.json({ success: true, guests: trip.guests });
  } catch (err) { next(err); }
});

router.delete("/:id/guests/:guestId", protect, async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

    if (trip.userId.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    trip.guests = trip.guests.filter(g => g.toString() !== req.params.guestId);
    await trip.save();

    res.json({ success: true, message: "Guest removed" });
  } catch (err) { next(err); }
});


module.exports = router;
