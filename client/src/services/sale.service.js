import axios from "axios";

// 🌐 Backend Base URL (Direct)
const API_URL = "https://im-server-f175.onrender.com/api/sales";

const api = axios.create({
  baseURL: API_URL,
});

// 🧾 Create a new sale
const createSale = (saleData) => {
  // Example: { cart: [], totalAmount: 1000, paymentMethod: 'Cash' }
  return api.post("/", saleData);
};

// 📜 Get all sales
const getSales = () => {
  return api.get("/");
};

const saleService = {
  createSale,
  getSales,
};

export default saleService;
