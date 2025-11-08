// File: client/src/services/category.service.js

import axios from 'axios';

const API_URL = 'https://im-server-f175.onrender.com/api/categories';

const api = axios.create({
  baseURL: API_URL,
});

// Get all categories
const getCategories = () => {
  return api.get('/');
};

// Create a new category
const createCategory = (name) => {
  // We send an object { name: "New Category Name" }
  return api.post('/', { name });
};

const categoryService = {
  getCategories,
  createCategory,
};

export default categoryService;
