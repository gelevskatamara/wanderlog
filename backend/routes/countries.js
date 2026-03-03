const express = require('express');
const router = express.Router();
const Country = require('../models/Country');
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country data (from REST Countries API)
 */

/**
 * @swagger
 * /countries:
 *   get:
 *     summary: Get all countries with optional search and region filter
 *     tags: [Countries]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200:
 *         description: List of countries
 */
router.get('/', async (req, res, next) => {
  try {
    const { search, region, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (region) filter.region = { $regex: region, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [countries, total] = await Promise.all([
      Country.find(filter).sort({ name: 1 }).skip(skip).limit(parseInt(limit)),
      Country.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      countries,
    });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /countries/sync:
 *   post:
 *     summary: Sync countries from REST Countries API (admin only)
 *     tags: [Countries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Countries synced
 */
router.post('/sync', protect, authorize('admin'), async (req, res, next) => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,flags,currencies,languages,cca2,flag');
    const data = await response.json();

    let synced = 0;
    for (const c of data) {
      const currencies = c.currencies
        ? Object.entries(c.currencies).map(([code, val]) => ({ code, name: val.name, symbol: val.symbol || '' }))
        : [];
      const languages = c.languages ? Object.values(c.languages) : [];

      await Country.findOneAndUpdate(
        { cca2: c.cca2 },
        {
          name: c.name?.common || '',
          officialName: c.name?.official || '',
          capital: c.capital?.[0] || '',
          region: c.region || '',
          subregion: c.subregion || '',
          population: c.population || 0,
          area: c.area || 0,
          flag: c.flag || '',
          flagUrl: c.flags?.svg || c.flags?.png || '',
          currencies,
          languages,
          borders: c.borders || [],
          timezone: c.timezones?.[0] || '',
          drivingSide: c.car?.side || '',
          cca2: c.cca2 || '',
          cca3: c.cca3 || '',
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      synced++;
    }

    res.json({ success: true, message: `Synced ${synced} countries` });
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /countries/{name}:
 *   get:
 *     summary: Get a single country by name
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Country data
 *       404:
 *         description: Country not found
 */
router.get('/:name', async (req, res, next) => {
  try {
    const country = await Country.findOne({ name: { $regex: `^${req.params.name}$`, $options: 'i' } });
    if (!country) return res.status(404).json({ success: false, message: 'Country not found' });
    res.json({ success: true, country });
  } catch (err) { next(err); }
});

module.exports = router;
