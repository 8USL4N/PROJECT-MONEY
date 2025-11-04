// src/components/market/MarketData.js
import React, { useState } from 'react';
import { marketAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

export default function MarketData() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [figi, setFigi] = useState('BBG004730N88');
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  const loadMarketData = async (selectedFigi = null) => {
    const figiToLoad = selectedFigi || figi;
    
    if (!figiToLoad.trim()) {
      setError('Введите FIGI или тикер инструмента');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Загружаем данные для FIGI:', figiToLoad);
      const response = await marketAPI.loadCandles(figiToLoad.trim(), 1);
      console.log('Получены данные:', response);
      
      // Обрабатываем новый формат ответа
      let candles = [];
      
      if (response && response.data) {
        // Формат: {data: {status: "ok", candles_saved: 1009, candles: [...]}}
        if (response.data.status === 'ok' && Array.isArray(response.data.candles)) {
          candles = response.data.candles;
          console.log(`Успешно загружено ${candles.length} свечей`);
        } else if (Array.isArray(response.data)) {
          // Альтернативный формат: {data: [...]}
          candles = response.data;
        } else {
          console.warn('Неизвестный формат data:', response.data);
          setError(`Неизвестный формат данных в data: ${JSON.stringify(response.data).substring(0, 100)}...`);
          setMarketData(null);
          return;
        }
      } else if (Array.isArray(response)) {
        // Если response уже массив
        candles = response;
      } else {
        console.warn('Неизвестный формат ответа:', response);
        setError(`Неизвестный формат данных: ${JSON.stringify(response).substring(0, 100)}...`);
        setMarketData(null);
        return;
      }
      
      if (!candles || candles.length === 0) {
        setError(`Нет данных для инструмента: ${figiToLoad}`);
        setMarketData(null);
        return;
      }
      
      setMarketData(candles);
    } catch (error) {
      console.error('Ошибка загрузки рыночных данных:', error);
      setError(`Ошибка загрузки данных для ${figiToLoad}: ${error.message}`);
      setMarketData(null);
    } finally {
      setLoading(false);
    }
  };

  const popularInstruments = [
    { figi: 'BBG004730N88', name: 'Сбербанк', symbol: 'SBER', price: 275.50, change: '+1.2%' },
    { figi: 'BBG004730RP0', name: 'Газпром', symbol: 'GAZP', price: 172.30, change: '+0.8%' },
    { figi: 'BBG00475JZZ6', name: 'Лукойл', symbol: 'LKOH', price: 5890.25, change: '+1.5%' },
    { figi: 'BBG006L8G4H1', name: 'Яндекс', symbol: 'YNDX', price: 4650.75, change: '-0.5%' },
    { figi: 'BBG004S681W1', name: 'ВТБ', symbol: 'VTBR', price: 0.0265, change: '+0.9%' },
    { figi: 'BBG00475K2X9', name: 'Роснефть', symbol: 'ROSN', price: 485.60, change: '+2.3%' },
  ];

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      loadMarketData();
    }
  };

  const handleInstrumentClick = (instrumentFigi) => {
    setFigi(instrumentFigi);
    loadMarketData(instrumentFigi);
  };

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleString('ru-RU');
    } catch (error) {
      return dateString;
    }
  };

  // Функция для расчета изменения цены
  const calculateChange = (candle) => {
    if (!candle || typeof candle.o !== 'number' || typeof candle.c !== 'number') {
      return { value: 0, percent: 0, isPositive: true };
    }
    
    const change = candle.c - candle.o;
    const changePercent = (change / candle.o) * 100;
    return {
      value: change,
      percent: changePercent,
      isPositive: change >= 0
    };
  };

  // Безопасное получение данных для отображения
  const getDisplayData = () => {
    if (!marketData) return [];
    
    if (Array.isArray(marketData)) {
      return marketData;
    }
    
    // Если marketData не массив, пытаемся преобразовать
    console.warn('marketData не является массивом:', marketData);
    return [];
  };

  const displayData = getDisplayData();

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Рыночные данные</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Данные рынка в реальном времени и анализ инструментов
        </p>
      </div>

      {/* Поиск и загрузка */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              FIGI инструмента или тикер
            </label>
            <input
              type="text"
              value={figi}
              onChange={(e) => setFigi(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="BBG004730N88 или SBER"
              className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                  : 'border border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>
          <button
            onClick={() => loadMarketData()}
            disabled={loading}
            className={`px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ${
              isDark
                ? 'bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {loading ? 'Загрузка...' : 'Загрузить данные'}
          </button>
        </div>
        
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}
        
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Текущий FIGI: <span className="font-mono">{figi}</span>
        </div>
        
        {/* Отладочная информация */}
        {marketData && (
          <div className="mt-4 p-3 rounded-xl bg-green-100 border border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200">
            <div className="text-sm font-semibold">Данные успешно загружены!</div>
            <div className="text-xs mt-1">
              Загружено свечей: {displayData.length}
            </div>
            <div className="text-xs">
              Первая свеча: {displayData[0] && formatDate(displayData[0].x)}
            </div>
            <div className="text-xs">
              Последняя свеча: {displayData[displayData.length - 1] && formatDate(displayData[displayData.length - 1].x)}
            </div>
          </div>
        )}
      </div>

      {/* Обзор рынка */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Популярные инструменты
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularInstruments.map((instrument, index) => (
            <div
              key={instrument.figi}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isDark
                  ? 'bg-gray-700 border-gray-600 hover:border-cyan-500'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-500'
              }`}
              onClick={() => handleInstrumentClick(instrument.figi)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">
                    {instrument.symbol}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {instrument.name}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  instrument.change.includes('+')
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {instrument.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {instrument.price.toLocaleString('ru-RU')} ₽
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                FIGI: {instrument.figi}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Визуализация данных */}
      {displayData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Данные свечей для {figi} ({displayData.length} свечей)
          </h3>
          
          {/* Статистика */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Количество свечей</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">{displayData.length}</div>
            </div>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Первая дата</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {formatDate(displayData[displayData.length - 1]?.x)}
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Последняя дата</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {formatDate(displayData[0]?.x)}
              </div>
            </div>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Последняя цена</div>
              <div className="text-xl font-bold text-gray-800 dark:text-white">
                {displayData[0]?.c}
              </div>
            </div>
          </div>

          {/* Таблица данных */}
          <div className={`rounded-2xl overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${
                    isDark ? 'border-gray-600' : 'border-gray-300'
                  }`}>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Время
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Открытие
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Макс.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Мин.
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Закрытие
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Объем
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Изменение
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayData.slice(0, 10).map((candle, index) => {
                    const change = calculateChange(candle);
                    return (
                      <tr 
                        key={index}
                        className={`border-b ${
                          isDark ? 'border-gray-600 hover:bg-gray-600' : 'border-gray-300 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(candle.x)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {candle.o}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {candle.h}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {candle.l}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">
                          {candle.c}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {candle.v}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 rounded-lg font-semibold ${
                            change.isPositive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {change.isPositive ? '+' : ''}{change.percent.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {displayData.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
              Показано 10 из {displayData.length} свечей
            </div>
          )}
        </div>
      )}
    </div>
  );
}