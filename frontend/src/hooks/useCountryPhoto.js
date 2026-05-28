import { useState, useEffect } from 'react';
import { getCountryPhoto } from '../services/api';
 
// Shared cache — persists for the whole session
const cache = {};
 
// Request queue — prevents hammering the API when 20 cards mount at once
const queue = [];
let processing = false;
 
const processQueue = () => {
  if (processing || queue.length === 0) return;
  processing = true;
  const { name, resolve, reject } = queue.shift();
 
  getCountryPhoto(name)
    .then(res => { cache[name] = res.data.photo; resolve(res.data.photo); })
    .catch(() => { cache[name] = null; reject(); })
    .finally(() => {
      processing = false;
      // Small delay between requests so we don't flood the API
      setTimeout(processQueue, 150);
    });
};
 
const fetchPhoto = (name) =>
  new Promise((resolve, reject) => {
    queue.push({ name, resolve, reject });
    processQueue();
  });
 
export default function useCountryPhoto(countryName) {
  const [photo, setPhoto] = useState(undefined); // undefined = not fetched yet
 
  useEffect(() => {
    if (!countryName) return;
 
    // Already in cache (including null = "not found")
    if (Object.prototype.hasOwnProperty.call(cache, countryName)) {
      setPhoto(cache[countryName]);
      return;
    }
 
    fetchPhoto(countryName)
      .then(p => setPhoto(p))
      .catch(() => setPhoto(null));
  }, [countryName]);
 
  return { photo, loading: photo === undefined };
}