// File: client/src/services/return.service.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/returns';

const api = axios.create({
  baseURL: API_URL,
});

/**
 * एक नया रिटर्न (वापसी) बनाता है
 */
const createReturn = (returnData) => {
  return api.post('/', returnData);
};

// --- (नया) सारे Return Bills पाने के लिए ---
/**
 * सारे रिटर्न बिल्स की हिस्ट्री लाता है
 */
const getReturns = () => {
  return api.get('/');
};
// --- ---

const returnService = {
  createReturn,
  getReturns, // नया फंक्शन एक्सपोर्ट करें
};

export default returnService;