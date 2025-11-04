// src/components/market/MarketData.js
import React, { useState } from 'react';
import { marketAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer 
} from 'recharts';

export default function MarketData() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [figi, setFigi] = useState('BBG004730N88');
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');
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
      const response = await marketAPI.loadCandles(figiToLoad.trim(), 7);
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
      
      // Преобразуем данные для графика
      const processedData = candles.map(candle => ({
        // Используем те же поля что были в таблице
        time: candle.time || candle.x,
        date: new Date(candle.time || candle.x).toLocaleDateString('ru-RU'),
        open: parseFloat(candle.o || candle.open),
        high: parseFloat(candle.h || candle.high),
        low: parseFloat(candle.l || candle.low),
        close: parseFloat(candle.c || candle.close),
        volume: parseFloat(candle.v || candle.volume),
        // Добавляем изменение в процентах
        change: ((parseFloat(candle.c || candle.close) - parseFloat(candle.o || candle.open)) / parseFloat(candle.o || candle.open)) * 100
      })).reverse(); // Реверсируем чтобы данные шли от старых к новым
      
      setMarketData(processedData);
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

  // Кастомный тултип для графиков
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-3 rounded-2xl border shadow-lg ${
          isDark 
            ? 'bg-gray-800 border-gray-600 text-white' 
            : 'bg-white border-gray-200 text-gray-900'
        }`}>
          <p className="font-semibold">{data.date}</p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Открытие:</span>{' '}
            <span className="font-medium">{data.open?.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Закрытие:</span>{' '}
            <span className={`font-medium ${data.close >= data.open ? 'text-green-500' : 'text-red-500'}`}>
              {data.close?.toFixed(2)}
            </span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Макс:</span>{' '}
            <span className="font-medium">{data.high?.toFixed(2)}</span>
          </p>
          <p className="text-sm">
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Мин:</span>{' '}
            <span className="font-medium">{data.low?.toFixed(2)}</span>
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
            dataKey="date" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            domain={['auto', 'auto']}
            tickFormatter={(value) => value.toLocaleString('ru-RU')}
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
            dataKey="date" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString('ru-RU')}
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
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
          <XAxis 
            dataKey="date" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            yAxisId="left" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString('ru-RU')}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            yAxisId="right" 
            dataKey="volume" 
            name="Объем"
            fill={isDark ? '#4b5563' : '#9ca3af'} 
            opacity={0.3} 
          />
          <Line 
            yAxisId="left"
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
            dataKey="date" 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke={isDark ? '#9ca3af' : '#6b7280'} 
            fontSize={12}
            tickFormatter={(value) => value.toLocaleString('ru-RU')}
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

  // Рендер графика в зависимости от выбранного типа
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
          {popularInstruments.map((instrument) => (
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
            </div>
          ))}
        </div>
      </div>

      {/* График */}
      {marketData && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              График {figi} ({marketData.length} свечей)
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className={`p-3 rounded-2xl text-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Количество свечей</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">{marketData.length}</div>
            </div>
            <div className={`p-3 rounded-2xl text-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Первая дата</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {marketData[marketData.length - 1]?.date}
              </div>
            </div>
            <div className={`p-3 rounded-2xl text-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Последняя дата</div>
              <div className="text-sm font-semibold text-gray-800 dark:text-white">
                {marketData[0]?.date}
              </div>
            </div>
            <div className={`p-3 rounded-2xl text-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-sm text-gray-600 dark:text-gray-400">Последняя цена</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white">
                {marketData[0]?.close?.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}