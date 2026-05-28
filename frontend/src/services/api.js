import axios from 'axios';

const API = axios.create({ baseURL: process.env.REACT_APP_API_URL || '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('wl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || '';
    const is401 = err.response?.status === 401;
    const isAuthRoute = url.includes('/auth/');
    // Only log out if it's an auth endpoint failing, not weather/countries/etc
    if (is401 && isAuthRoute) {
      localStorage.removeItem('wl_token');
      localStorage.removeItem('wl_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const register = (d) => API.post('/auth/register', d);
export const login = (d) => API.post('/auth/login', d);
export const getMe = () => API.get('/auth/me');
export const updateMe = (d) => API.put('/auth/me', d);
export const changePassword = (d) => API.put('/auth/change-password', d);

export const getTrips = (p) => API.get('/trips', { params: p });
export const getTrip = (id) => API.get(`/trips/${id}`);
export const getTripStats = () => API.get('/trips/stats');
export const getAllTrips = () => API.get('/trips/all');
export const createTrip = (d) => API.post('/trips', d);
export const updateTrip = (id, d) => API.put(`/trips/${id}`, d);
export const deleteTrip = (id) => API.delete(`/trips/${id}`);

export const getCountries = (p) => API.get('/countries', { params: p });
export const getCountry = (name) => API.get(`/countries/${encodeURIComponent(name)}`);
export const syncCountries = () => API.post('/countries/sync');

export const getTripReviews = (tid) => API.get(`/reviews/trip/${tid}`);
export const createReview = (d) => API.post('/reviews', d);
export const updateReview = (id, d) => API.put(`/reviews/${id}`, d);
export const deleteReview = (id) => API.delete(`/reviews/${id}`);

export const getWeather = (city) => API.get(`/weather/${encodeURIComponent(city)}`);

export const getNotifications = () => API.get('/notifications');
export const markRead = (id) => API.put(`/notifications/${id}/read`);
export const markAllRead = () => API.put('/notifications/read-all');

export const getAdminStats = () => API.get('/admin/stats');
export const getAdminUsers = (p) => API.get('/admin/users', { params: p });
export const updateUserRole = (id, d) => API.put(`/admin/users/${id}`, d);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);

export default API;

export const getCountryPhoto = (name) => API.get(`/images/country/${encodeURIComponent(name)}`);