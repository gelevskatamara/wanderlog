const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Weather
 *   description: Live weather data via OpenWeatherMap
 */

/**
 * @swagger
 * /weather/{city}:
 *   get:
 *     summary: Get current weather for a city
 *     tags: [Weather]
 *     parameters:
 *       - in: path
 *         name: city
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Current weather data
 *       404:
 *         description: City not found
 */
router.get('/:city', async (req, res, next) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ success: false, message: 'Weather API key not configured' });
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(req.params.city)}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      return res.status(data.cod).json({ success: false, message: data.message });
    }

    res.json({
      success: true,
      weather: {
        city: data.name,
        country: data.sys.country,
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        windSpeed: data.wind.speed,
        visibility: data.visibility,
      },
    });
  } catch (err) { next(err); }
});

module.exports = router;
