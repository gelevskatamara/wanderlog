const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  officialName: { type: String, default: '' },
  capital: { type: String, default: '' },
  region: { type: String, default: '' },
  subregion: { type: String, default: '' },
  population: { type: Number, default: 0 },
  area: { type: Number, default: 0 },
  flag: { type: String, default: '' },          // emoji flag
  flagUrl: { type: String, default: '' },        // SVG url from REST Countries
  currencies: [{ name: String, symbol: String, code: String }],
  languages: [String],
  callingCodes: [String],
  borders: [String],                             // ISO codes of bordering countries
  timezone: { type: String, default: '' },
  drivingSide: { type: String, default: '' },
  cca2: { type: String, default: '' },           // ISO 3166-1 alpha-2
  cca3: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Country', countrySchema);
