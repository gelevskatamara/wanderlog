const express = require('express');
const router = express.Router();
 
router.get('/country/:name', async (req, res, next) => {
  try {
    const key = process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return res.status(503).json({ success: false, message: 'Image service not configured' });
 
    const query = `${req.params.name} landscape travel`;
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&client_id=${key}`;
 
    const response = await fetch(url);
    const text = await response.text();
 
    // Handle rate limit or non-JSON response gracefully
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: response.status === 403 ? 'Rate limit exceeded' : 'Image service unavailable',
      });
    }
 
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ success: false, message: 'Invalid response from image service' });
    }
 
    const photo = data.results?.[0];
    if (!photo) return res.status(404).json({ success: false, message: 'No photo found' });
 
    res.json({
      success: true,
      photo: {
        url: photo.urls.regular,
        small: photo.urls.small,
        thumb: photo.urls.thumb,
        credit: { name: photo.user.name, link: photo.user.links.html },
      },
    });
  } catch (err) { next(err); }
});
 
module.exports = router;