import axios from 'axios';

const API_BASE_URL = 'https://192.168.0.28:8000/';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Отправлять cookies (сессия)
  timeout: 10000,
});

// Логи для разработки
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
    api.get('/auth/me'), // Возвращает { id, username, email }
};

// === ТОРГОВЛЯ ===
export const tradeAPI = {
  getPortfolio: (accountId = null) => 
    api.get('/trade/portfolio', { params: { account_id: accountId } }),
  
  executeOrder: (orderData) => api.post('/trade/execute', orderData),

  // Эндпоинты для счетов
  openSandboxAccount: (accountType = "ACCOUNT_TYPE_TINKOFF") => 
    api.post('/accounts/open', { account_type: accountType }),
  
  sandboxPayIn: (accountId, amount, currency = "RUB") => 
    api.post('/accounts/payin', { account_id: accountId, amount, currency }),

  getAccounts: () => api.get('/accounts/'),
  
  // Новые методы для работы с балансом и портфелем по счету
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
  
  // Добавленный endpoint для получения текущей цены
  getCurrentPrice: (figi) =>
    api.get(`/market/current-price/${figi}`),
};

// === МОДЕЛИ И БЭКТЕСТ ===
export const modelAPI = {
  // Исправленные методы - теперь принимают параметры
  trainSVR: (params = {}) => api.post('/model/train/svr', params),
  trainGPR: (params = {}) => api.post('/model/train/gpr', params),
  trainSVRSimple: (params = {}) => api.post('/model/train/svr/simple', params),
  getModels: () => api.get('/model/list'),
  
  // Новый метод для отладки
  debugRequest: (data) => api.post('/model/debug/raw', data),
};

export const backtestAPI = {
  runBacktest: (prices, predictions) =>
    api.post('/backtest/', { prices, predictions }),
};

export default api;