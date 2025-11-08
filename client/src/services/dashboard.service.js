// File: client/src/services/dashboard.service.js

import axios from 'axios';

const API_URL = 'https://im-server-f175.onrender.com/api/dashboard';

const api = axios.create({
  baseURL: API_URL,
});

// Get dashboard stats
const getStats = () => {
  return api.get('/stats');
};

const dashboardService = {
  getStats,
};

export default dashboardService;
