const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Trip = require('../models/Trip');
const Notification = require('../models/Notification');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Trip reviews
 */

/**
 * @swagger
 * /reviews/trip/{tripId}:
 *   get:
 *     summary: Get all reviews for a trip
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/trip/:tripId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ tripId: req.params.tripId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review for a trip
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Already reviewed this trip
 */
router.post('/', protect, authorize('user', 'admin'), async (req, res, next) => {
  try {
    const { tripId, rating, comment } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const existing = await Review.findOne({ userId: req.user._id, tripId });
    if (existing) return res.status(400).json({ success: false, message: 'You already reviewed this trip' });

    const review = await Review.create({ tripId, rating, comment, userId: req.user._id });

    await Notification.create({
      userId: req.user._id,
      message: `Your review for "${trip.title}" has been posted.`,
      type: 'review_added',
    });

    res.status(201).json({ success: true, review });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /reviews/{id}:
 *   put:
 *     summary: Update a review
 *     tags: [Reviews]
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
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, review: updated });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorised' });

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
