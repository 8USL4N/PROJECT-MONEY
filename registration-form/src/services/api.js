import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`Response received:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });

    if (error.code === 'ECONNREFUSED') {
      console.error('Backend server is not running. Please start the FastAPI server.');
      return Promise.reject(new Error('Cannot connect to server. Please make sure the backend is running.'));
    }

    if (error.response?.status === 401) {
      // Remove invalid token
      document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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