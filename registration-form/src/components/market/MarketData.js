// src/components/market/MarketData.js
import React, { useState, useEffect, useRef } from 'react';
import { marketAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';

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
];

export default function MarketData() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [figi, setFigi] = useState('BBG004730N88');
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
  const [searchQuery, setSearchQuery] = useState('SBER - Сбербанк');
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

  // Загрузка данных при монтировании для выбранного инструмента по умолчанию
  useEffect(() => {
    loadMarketData('BBG004730N88');
  }, []);

  const handleInstrumentSelect = (instrument) => {
    setFigi(instrument.figi);
    setSearchQuery(`${instrument.symbol} - ${instrument.name}`);
    setShowDropdown(false);
    setError(null);
    loadMarketData(instrument.figi);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      setShowDropdown(false);
      if (filteredInstruments.length > 0) {
        handleInstrumentSelect(filteredInstruments[0]);
      } else if (figi) {
        loadMarketData();
      }
    }
  };

  const loadMarketData = async (selectedFigi = null) => {
    const figiToLoad = selectedFigi || figi;

    if (!figiToLoad.trim()) {
      setError('Введите FIGI или тикер инструмента');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Загрузка данных для FIGI:', figiToLoad);
      const response = await marketAPI.loadCandles(figiToLoad.trim(), 1);
      console.log('Получен ответ:', response);

      let candles = [];

      if (response && response.data) {
        if (response.data.status === 'ok' && Array.isArray(response.data.candles)) {
          candles = response.data.candles;
        } else if (Array.isArray(response.data)) {
          candles = response.data;
        } else {
          console.error('Неизвестный формат данных:', response.data);
          setError('Неизвестный формат данных от сервера');
          setMarketData(null);
          return;
        }
      } else {
        console.error('Неизвестный формат ответа:', response);
        setError('Неизвестный формат ответа от сервера');
        setMarketData(null);
        return;
      }

      if (!candles || candles.length === 0) {
        setError(`Нет данных для инструмента: ${figiToLoad}`);
        setMarketData(null);
        return;
      }

      console.log('Получены свечи:', candles);

      // ПРАВИЛЬНОЕ преобразование данных для графика
      const processedData = candles.map(candle => {
        // Определяем формат данных (новый с x,o,h,l,c,v или старый с time,open,high,low,close,volume)
        const time = candle.x || candle.time;
        const open = candle.o || candle.open;
        const high = candle.h || candle.high;
        const low = candle.l || candle.low;
        const close = candle.c || candle.close;
        const volume = candle.v || candle.volume;

        // Парсим время
        let timestamp;
        try {
          timestamp = new Date(time);
          if (isNaN(timestamp.getTime())) {
            console.warn('Некорректное время:', time);
            timestamp = new Date();
          }
        } catch (e) {
          console.warn('Ошибка парсинга времени:', time, e);
          timestamp = new Date();
        }

        const dateStr = timestamp.toLocaleDateString('ru-RU');
        const timeStr = timestamp.toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        });

        const openNum = parseFloat(open);
        const closeNum = parseFloat(close);
        const change = ((closeNum - openNum) / openNum) * 100;

        return {
          timestamp,
          time: timeStr,
          date: dateStr,
          datetime: `${dateStr} ${timeStr}`,
          open: openNum,
          high: parseFloat(high),
          low: parseFloat(low),
          close: closeNum,
          volume: parseFloat(volume),
          change: isNaN(change) ? 0 : change
        };
      });

      // Сортируем по времени (от старых к новым) - ВАЖНО для правильного отображения графика
      processedData.sort((a, b) => a.timestamp - b.timestamp);

      console.log('Обработанные данные:', processedData);
      setMarketData(processedData);

    } catch (error) {
      console.error('Ошибка загрузки рыночных данных:', error);
      setError(`Ошибка загрузки данных: ${error.response?.data?.detail || error.message}`);
      setMarketData(null);
    } finally {
      setLoading(false);
    }
  };

  // Кастомный тултип
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-2xl border shadow-lg ${
          isDark
            ? 'bg-gray-800 border-gray-600 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{data.datetime}</p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Открытие:</span>{' '}
            <span className="font-medium">{data.open?.toFixed(2)} ₽</span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Закрытие:</span>{' '}
            <span className={`font-medium ${data.close >= data.open ? 'text-green-500' : 'text-red-500'}`}>
              {data.close?.toFixed(2)} ₽
            </span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Макс:</span>{' '}
            <span className="font-medium">{data.high?.toFixed(2)} ₽</span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Мин:</span>{' '}
            <span className="font-medium">{data.low?.toFixed(2)} ₽</span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Объем:</span>{' '}
            <span className="font-medium">{data.volume?.toLocaleString('ru-RU')}</span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Изменение:</span>{' '}
            <span className={`font-medium ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.change?.toFixed(2)}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Линейный график
  const LineChartComponent = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="time"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="close"
            name="Цена закрытия"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Area график
  const AreaChartComponent = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="time"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area
            type="monotone"
            dataKey="close"
            name="Цена закрытия"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorClose)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // Комбинированный график (цена + объем)
  const CombinedChart = ({ data }) => {
    // Нормализуем объем для отображения на одном графике
    const maxPrice = Math.max(...data.map(d => d.close));
    const maxVolume = Math.max(...data.map(d => d.volume));
    const scaleFactor = maxPrice / maxVolume * 0.3; // Масштабируем объемы

    const scaledData = data.map(d => ({
      ...d,
      scaledVolume: d.volume * scaleFactor
    }));

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={scaledData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="time"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="scaledVolume"
            name="Объем (масштабир.)"
            fill={isDark ? '#4b5563' : '#9ca3af'}
            opacity={0.3}
          />
          <Line
            type="monotone"
            dataKey="close"
            name="Цена закрытия"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  // Свечной график (упрощенный)
  const CandlestickChart = ({ data }) => {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis
            dataKey="time"
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            interval="preserveStartEnd"
          />
          <YAxis
            stroke={isDark ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="high"
            name="Максимум"
            stroke="#ef4444"
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="low"
            name="Минимум"
            stroke="#22c55e"
            strokeWidth={1}
            dot={false}
            strokeDasharray="3 3"
          />
          <Line
            type="monotone"
            dataKey="close"
            name="Цена закрытия"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // Рендер графика
  const renderChart = () => {
    if (!marketData || marketData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          Загрузите данные для отображения графика
        </div>
      );
    }

    switch (chartType) {
      case 'line':
        return <LineChartComponent data={marketData} />;
      case 'area':
        return <AreaChartComponent data={marketData} />;
      case 'combined':
        return <CombinedChart data={marketData} />;
      case 'candlestick':
        return <CandlestickChart data={marketData} />;
      default:
        return <LineChartComponent data={marketData} />;
    }
  };

  // Получение статистики
  const getStats = () => {
    if (!marketData || marketData.length === 0) return null;

    const closes = marketData.map(d => d.close);
    const volumes = marketData.map(d => d.volume);

    return {
      count: marketData.length,
      firstDate: marketData[0]?.datetime,
      lastDate: marketData[marketData.length - 1]?.datetime,
      currentPrice: marketData[marketData.length - 1]?.close,
      minPrice: Math.min(...closes),
      maxPrice: Math.max(...closes),
      avgVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Рыночные данные</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Графики рыночных данных в реальном времени
        </p>
      </div>

      {/* Поиск и загрузка */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Инструмент
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleInputFocus}
                onKeyPress={handleKeyPress}
                placeholder="Начните вводить тикер или название..."
                className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                    : 'border border-gray-300 focus:ring-blue-500'
                }`}
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
            </div>

            {/* Отображение выбранного FIGI */}
            {figi && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Выбран FIGI: <span className="font-mono">{figi}</span>
              </div>
            )}
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
            {loading ? 'Загрузка...' : 'Загрузить график'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-100 border border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Популярные инструменты */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Популярные инструменты
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_INSTRUMENTS.map((instrument) => (
            <div
              key={instrument.figi}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isDark
                  ? 'bg-gray-700 border-gray-600 hover:border-cyan-500'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-500'
              } ${figi === instrument.figi ? (isDark ? 'ring-2 ring-cyan-500' : 'ring-2 ring-blue-500') : ''}`}
              onClick={() => handleInstrumentSelect(instrument)}
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
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                FIGI: {instrument.figi}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* График */}
      {marketData && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              График {searchQuery.split(' - ')[0]} ({marketData.length} свечей)
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'line', label: 'Линия' },
                { type: 'area', label: 'Область' },
                { type: 'combined', label: 'Цена+Объем' },
                { type: 'candlestick', label: 'Свечной' }
              ].map(({ type, label }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    chartType === type
                      ? isDark
                        ? 'bg-cyan-600 text-white'
                        : 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl p-4 ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {renderChart()}
          </div>

          {/* Статистика */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className={`p-3 rounded-2xl text-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-sm text-gray-600 dark:text-gray-400">Количество свечей</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">{stats.count}</div>
              </div>
              <div className={`p-3 rounded-2xl text-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-sm text-gray-600 dark:text-gray-400">Текущая цена</div>
                <div className="text-lg font-bold text-gray-800 dark:text-white">
                  {stats.currentPrice?.toFixed(2)} ₽
                </div>
              </div>
              <div className={`p-3 rounded-2xl text-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-sm text-gray-600 dark:text-gray-400">Минимум</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                  {stats.minPrice?.toFixed(2)} ₽
                </div>
              </div>
              <div className={`p-3 rounded-2xl text-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-sm text-gray-600 dark:text-gray-400">Максимум</div>
                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                  {stats.maxPrice?.toFixed(2)} ₽
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}