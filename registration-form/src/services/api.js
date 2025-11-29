// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

api.interceptors.request.use(config => {
  console.log(`→ ${config.method?.toUpperCase()} ${config.url}`, config.data);
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
    api.get('/auth/me'),
};

// === ТОРГОВЛЯ ===
export const tradeAPI = {
  getPortfolio: (accountId = null) =>
    api.get('/trade/portfolio', { params: { account_id: accountId } }),

  executeOrder: (orderData) => api.post('/trade/execute', orderData),

  openSandboxAccount: (accountType = "ACCOUNT_TYPE_TINKOFF") =>
    api.post('/accounts/open', { account_type: accountType }),

  sandboxPayIn: (accountId, amount, currency = "RUB") =>
    api.post('/accounts/payin', { account_id: accountId, amount, currency }),

  getAccounts: () => api.get('/accounts/'),

  getAccountBalance: (accountId = null) =>
    api.get('/accounts/balance', { params: { account_id: accountId } }),

  getAccountPortfolio: (accountId = null) =>
    api.get('/accounts/portfolio', { params: { account_id: accountId } }),

  getAccountOperations: (accountId, fromDate, toDate) =>
    api.get('/accounts/operations', {
      params: { account_id: accountId, from_date: fromDate, to_date: toDate }
    }),

  closeAccount: (accountId) =>
    api.delete(`/accounts/${accountId}`),
};

// === РЫНОК ===
export const marketAPI = {
  loadCandles: (figi, days = 1) =>
    api.get(`/market/candles/${figi}?days=${days}`),

  getCurrentPrice: (figi) =>
    api.get(`/market/current-price/${figi}`),

  // НОВЫЕ МЕТОДЫ ДЛЯ УПРАВЛЕНИЯ СВЕЧАМИ
  getUserCandles: (skip = 0, limit = 100) =>
    api.get(`/market/user-candles?skip=${skip}&limit=${limit}`),

  deleteUserCandles: (figi) =>
    api.delete(`/market/user-candles/${figi}`),

  getCandleDataForML: (figi, startDate = null, endDate = null) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return api.get(`/market/user-candles/${figi}/data`, { params });
  }
};

// === МОДЕЛИ ===
export const modelAPI = {
  trainSVR: (params = {}) => api.post('/models/train/svr', params),
  trainGPR: (params = {}) => api.post('/models/train/gpr', params),
  trainAdaptive: (params = {}) => api.post('/models/train/adaptive', params),

  getModels: () => api.get('/models/my-models'),
  debugRequest: (data) => api.post('/model/debug/raw', data),
};

// === БЭКТЕСТ ===
export const backtestAPI = {
  runBacktest: (prices, predictions) => api.post('/backtest/', { prices, predictions }),

  // Новые методы для бэктеста
  getBacktestResults: () => api.get('/backtest/results'),
  getBacktestDetail: (id) => api.get(`/backtest/results/${id}`),
  deleteBacktestResult: (id) => api.delete(`/backtest/results/${id}`),
};

export default api;