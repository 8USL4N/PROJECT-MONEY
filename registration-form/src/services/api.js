import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token if needed
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  register: (userData) => 
    api.post('/auth/register', userData),
  
  logout: () => 
    api.post('/auth/logout'),
  
  getMe: () => 
    api.get('/auth/me'),
};

// Market API
export const marketAPI = {
  loadCandles: (figi, days = 1) =>
    api.get(`/market/candles/${figi}?days=${days}`),
};

// Trade API
export const tradeAPI = {
  executeOrder: (orderData) =>
    api.post('/trade/execute', orderData),
  
  getPortfolio: () =>
    api.get('/trade/portfolio'),
};

// Model API
export const modelAPI = {
  trainSVR: () =>
    api.post('/model/train/svr'),
};

// Backtest API
export const backtestAPI = {
  runBacktest: (prices, predictions) =>
    api.post('/backtest/', { prices, predictions }),
};

export default api;