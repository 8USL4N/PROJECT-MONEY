// src/components/trading/Trading.js
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { tradeAPI, marketAPI } from '../../services/api';

// Список популярных инструментов с FIGI и названиями
const POPULAR_INSTRUMENTS = [
  { figi: 'BBG004730N88', symbol: 'SBER', name: 'Сбербанк' },
  { figi: 'BBG004730RP0', symbol: 'GAZP', name: 'Газпром' },
  { figi: 'BBG00475JZZ6', symbol: 'LKOH', name: 'Лукойл' },
  { figi: 'BBG006L8G4H1', symbol: 'YNDX', name: 'Яндекс' },
  { figi: 'BBG004S681W1', symbol: 'VTBR', name: 'ВТБ' },
  { figi: 'BBG00475K2X9', symbol: 'ROSN', name: 'Роснефть' },
  { figi: 'BBG004S68B31', symbol: 'ALRS', name: 'АЛРОСА' },
  { figi: 'BBG004RVFCY3', symbol: 'MGNT', name: 'Магнит' },
  { figi: 'BBG004S683W7', symbol: 'TATN', name: 'Татнефть' },
  { figi: 'BBG00475J7C8', symbol: 'MOEX', name: 'Московская биржа' },
  { figi: 'BBG004S68758', symbol: 'NLMK', name: 'НЛМК' },
  { figi: 'BBG00475K6C4', symbol: 'GMKN', name: 'Норникель' },
  { figi: 'BBG004S681B4', symbol: 'MTSS', name: 'МТС' },
  { figi: 'BBG004S68507', symbol: 'AFKS', name: 'Система' },
  { figi: 'BBG00475KKY8', symbol: 'PLZL', name: 'Полюс' },
];

export default function Trading() {
  const [orderType, setOrderType] = useState('buy');
  const [figi, setFigi] = useState('');
  const [quantity, setQuantity] = useState('');
  const [currentPrice, setCurrentPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { isDark } = useTheme();

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Фильтрация инструментов по поисковому запросу
  const filteredInstruments = POPULAR_INSTRUMENTS.filter(instrument =>
    instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instrument.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instrument.figi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Автозакрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInstrumentSelect = (instrument) => {
    setFigi(instrument.figi);
    setSearchQuery(`${instrument.symbol} - ${instrument.name}`);
    setShowDropdown(false);
    setCurrentPrice(null);
    setMessage('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setFigi(value); // Позволяет вводить FIGI вручную
    
    if (value.length > 0) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleInputFocus = () => {
    if (searchQuery.length > 0 || filteredInstruments.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!figi) {
      setMessage('❌ Пожалуйста, выберите или введите FIGI');
      return;
    }

    if (!quantity || quantity <= 0) {
      setMessage('❌ Пожалуйста, укажите корректное количество');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const orderData = {
        figi,
        side: orderType.toLowerCase(),
        qty: parseInt(quantity),
      };

      console.log('Отправка ордера:', orderData);

      const response = await tradeAPI.executeOrder(orderData);

      setMessage(`✅ Ордер успешно исполнен! ${orderType === 'buy' ? 'Покупка' : 'Продажа'} ${quantity} акций`);

      setQuantity('');
      setFigi('');
      setSearchQuery('');
      setCurrentPrice(null);

    } catch (error) {
      console.error('Ошибка исполнения ордера:', error);
      const errorData = error.response?.data;
      if (errorData?.detail) {
        setMessage(`❌ Ошибка: ${errorData.detail}`);
      } else if (errorData && typeof errorData === 'object') {
        const errorMessages = Object.entries(errorData)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('; ');
        setMessage(`❌ Ошибка валидации: ${errorMessages}`);
      } else {
        setMessage(`❌ Ошибка: ${error.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoadPrice = async () => {
    if (!figi) {
      setMessage('❌ Пожалуйста, выберите инструмент');
      return;
    }
    try {
      const response = await marketAPI.getCurrentPrice(figi);
      console.log('Ответ API getCurrentPrice:', response.data);
      if (response.data && response.data.current_price != null) {
        setCurrentPrice(response.data.current_price);
        setMessage(`💰 Текущая цена: ${response.data.current_price.toLocaleString('ru-RU')} ₽`);
      } else {
        setMessage('❌ Не удалось получить цену');
      }
    } catch (error) {
      console.error('Ошибка загрузки цены:', error);
      setMessage('❌ Не удалось получить цену');
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Торговля</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Совершайте сделки с AI-рекомендациями
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl ${
          message.includes('❌') 
            ? 'bg-red-100 border border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
            : message.includes('💰')
            ? 'bg-blue-100 border border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
            : 'bg-green-100 border border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Новая сделка</h3>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="flex rounded-2xl bg-gray-100 dark:bg-gray-700 p-1">
              <button
                type="button"
                onClick={() => setOrderType('buy')}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  orderType === 'buy'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                Покупка
              </button>
              <button
                type="button"
                onClick={() => setOrderType('sell')}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  orderType === 'sell'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
                }`}
              >
                Продажа
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Инструмент
              </label>
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                placeholder="Начните вводить тикер или название..."
                className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                    : 'border border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              
              {/* Выпадающий список */}
              {showDropdown && filteredInstruments.length > 0 && (
                <div 
                  ref={dropdownRef}
                  className={`absolute z-50 w-full mt-1 rounded-2xl shadow-lg border max-h-60 overflow-auto ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-200'
                  }`}
                >
                  {filteredInstruments.map((instrument) => (
                    <div
                      key={instrument.figi}
                      className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${
                        isDark
                          ? 'hover:bg-gray-600 text-white'
                          : 'hover:bg-gray-100 text-gray-900'
                      } ${figi === instrument.figi ? (isDark ? 'bg-cyan-600' : 'bg-blue-100') : ''}`}
                      onClick={() => handleInstrumentSelect(instrument)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{instrument.symbol}</div>
                          <div className="text-sm opacity-70">{instrument.name}</div>
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {instrument.figi}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Отображение выбранного FIGI */}
              {figi && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Выбран FIGI: <span className="font-mono">{figi}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Количество акций
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="1"
                className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                    : 'border border-gray-300 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
            </div>

            <button
              type="button"
              onClick={handleLoadPrice}
              disabled={!figi || loading}
              className={`w-full py-2 rounded-2xl font-semibold transition-all duration-300 ${
                !figi || loading
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : isDark
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Показать текущую цену
            </button>

            {currentPrice && (
              <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Примерная сумма:</span>
                  <span className="text-lg font-bold text-gray-800 dark:text-white">
                    {(quantity * currentPrice).toLocaleString('ru-RU', {minimumFractionDigits: 2})} ₽
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  *Фактическая сумма может отличаться
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !quantity || quantity <= 0 || !figi}
              className={`w-full py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg ${
                orderType === 'buy'
                  ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Исполнение...
                </div>
              ) : (
                `${orderType === 'buy' ? 'Купить' : 'Продать'} ${quantity} акций`
              )}
            </button>
          </form>
        </div>

        {/* Блок с популярными инструментами для быстрого выбора */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Популярные инструменты
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {POPULAR_INSTRUMENTS.slice(0, 8).map((instrument) => (
              <button
                key={instrument.figi}
                onClick={() => handleInstrumentSelect(instrument)}
                className={`p-3 rounded-2xl text-left transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                    : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                } ${figi === instrument.figi ? (isDark ? 'ring-2 ring-cyan-500' : 'ring-2 ring-blue-500') : ''}`}
              >
                <div className="font-semibold text-gray-800 dark:text-white">
                  {instrument.symbol}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {instrument.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {instrument.figi}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}