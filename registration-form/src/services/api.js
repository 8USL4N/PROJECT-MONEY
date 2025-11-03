import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Отправлять cookies (сессия)
  timeout: 10000,
});

// Логи для разработки
api.interceptors.request.use(config => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`← ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// === АУТЕНТИФИКАЦИЯ ===
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (userData) =>
    api.post('/auth/register', userData),

  logout: () =>
    api.post('/auth/logout'),

  getMe: () =>
    api.get('/auth/me'), // Возвращает { id, username, email }
};

// === ТОРГОВЛЯ ===
export const tradeAPI = {
  getPortfolio: () => api.get('/trade/portfolio'),
  executeOrder: (orderData) => api.post('/trade/execute', orderData),
};

// === РЫНОК ===
export const marketAPI = {
  loadCandles: (figi, days = 1) =>
    api.get(`/market/candles/${figi}?days=${days}`),
};

// === МОДЕЛИ И БЭКТЕСТ (если нужны) ===
export const modelAPI = {
  trainSVR: () => api.post('/model/train/svr'),
};

export const backtestAPI = {
  runBacktest: (prices, predictions) =>
    api.post('/backtest/', { prices, predictions }),
};

export default api;