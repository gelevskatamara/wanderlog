const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Trip = require('../models/Trip');
const TripPhoto = require('../models/TripPhoto');
const { protect } = require('../middleware/auth');
const { uploadAvatar, uploadTripPhoto } = require('../middleware/upload');

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: File upload endpoints
 */

/**
 * @swagger
 * /uploads/avatar:
 *   post:
 *     summary: Upload or update user avatar
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded
 */
router.post("/avatar", protect, (req, res) => {
  uploadAvatar(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });

    try {
      // Delete old avatar if exists
      const user = await User.findById(req.user._id);
      if (user.avatar) {
        const oldPath = path.join(__dirname, "../public", user.avatar);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;
      const updated = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: avatarUrl },
        { new: true }
      );

      res.json({ success: true, avatar: avatarUrl, user: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

/**
 * @swagger
 * /uploads/avatar:
 *   delete:
 *     summary: Remove user avatar
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Avatar removed
 */
router.delete("/avatar", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.avatar) {
      const oldPath = path.join(__dirname, "../public", user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      await User.findByIdAndUpdate(req.user._id, { avatar: "" });
    }
    res.json({ success: true, message: "Avatar removed" });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /uploads/trips/{id}/photos:
 *   post:
 *     summary: Upload a photo to a trip gallery
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *               caption:
 *                 type: string
 *     responses:
 *       201:
 *         description: Photo uploaded
 */
router.post("/trips/:id/photos", protect, (req, res) => {
  uploadTripPhoto(req, res, async (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: "No files uploaded" });

    try {
      const trip = await Trip.findById(req.params.id);
      if (!trip) return res.status(404).json({ success: false, message: "Trip not found" });

      const ownerId = trip.userId.toString();
      if (ownerId !== req.user._id.toString() && req.user.role !== "admin")
        return res.status(403).json({ success: false, message: "Not authorised" });

      const photos = await Promise.all(
        req.files.map((file) =>
          TripPhoto.create({
            tripId: req.params.id,
            userId: req.user._id,
            url: `/uploads/trips/${file.filename}`,
            caption: req.body.caption || "",
          })
        )
      );

      res.status(201).json({ success: true, count: photos.length, photos });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
});

/**
 * @swagger
 * /uploads/trips/{id}/photos:
 *   get:
 *     summary: Get all photos for a trip
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of photos
 */
router.get("/trips/:id/photos", async (req, res, next) => {
  try {
    const photos = await TripPhoto.find({ tripId: req.params.id })
      .populate("userId", "name")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: photos.length, photos });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /uploads/photos/{photoId}:
 *   delete:
 *     summary: Delete a trip photo
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: photoId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Photo deleted
 */
router.delete("/photos/:photoId", protect, async (req, res, next) => {
  try {
    const photo = await TripPhoto.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });

    if (photo.userId.toString() !== req.user._id.toString() && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    // Delete file from disk
    const filePath = path.join(__dirname, "../public", photo.url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await photo.deleteOne();
    res.json({ success: true, message: "Photo deleted" });
  } catch (err) { next(err); }
});

module.exports = router;
