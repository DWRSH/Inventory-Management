// File: client/src/services/sale.service.js

import axios from 'axios';

// API का बेस URL सेट करें
const API_URL = 'https://im-server-f175.onrender.com/api/sales';

const api = axios.create({
  baseURL: API_URL,
});

// Create a new sale
const createSale = (saleData) => {
  // saleData should be an object like:
  // { cart: [], totalAmount: 1000, paymentMethod: 'Cash' }
  return api.post('/', saleData);
};

// Get all sales history
const getSales = () => {
  return api.get('/');
};

// Make sure both functions are exported
const saleService = {
  createSale,
  getSales, // This was missing
};

export default saleService;
