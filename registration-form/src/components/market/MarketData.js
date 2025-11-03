// src/components/market/MarketData.js
import React, { useState } from 'react';
import { marketAPI } from '../../services/api';
import { useTheme } from '../../contexts/ThemeContext';

export default function MarketData() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [figi, setFigi] = useState('BBG000B9XRY4');
  const { isDark } = useTheme();

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const response = await marketAPI.loadCandles(figi, 30); // 30 days for market page
      setMarketData(response.data);
    } catch (error) {
      console.error('Error loading market data:', error);
      alert('Error loading market data');
    } finally {
      setLoading(false);
    }
  };

  const popularInstruments = [
    { figi: 'BBG000B9XRY4', name: 'Apple Inc.', symbol: 'AAPL', price: 182.63, change: '+1.2%' },
    { figi: 'BBG000BVPV84', name: 'Alphabet Inc.', symbol: 'GOOGL', price: 138.21, change: '+0.8%' },
    { figi: 'BBG000C2P3G6', name: 'Amazon.com Inc.', symbol: 'AMZN', price: 145.18, change: '+1.5%' },
    { figi: 'BBG006L8G4H4', name: 'Tesla Inc.', symbol: 'TSLA', price: 234.72, change: '-0.5%' },
    { figi: 'BBG000BPH459', name: 'Microsoft Corp.', symbol: 'MSFT', price: 378.85, change: '+0.9%' },
    { figi: 'BTC-USD', name: 'Bitcoin USD', symbol: 'BTC-USD', price: 43256.78, change: '+2.3%' },
  ];

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Market Data</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Real-time market data and instrument analysis
        </p>
      </div>

      {/* Search and Load Section */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instrument FIGI or Symbol
            </label>
            <input
              type="text"
              value={figi}
              onChange={(e) => setFigi(e.target.value)}
              placeholder="BBG000B9XRY4 or AAPL"
              className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                  : 'border border-gray-300 focus:ring-blue-500'
              }`}
            />
          </div>
          <button
            onClick={loadMarketData}
            disabled={loading}
            className={`px-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ${
              isDark
                ? 'bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {loading ? 'Loading...' : 'Load Data'}
          </button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Popular Instruments
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularInstruments.map((instrument, index) => (
            <div
              key={index}
              className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isDark
                  ? 'bg-gray-700 border-gray-600 hover:border-cyan-500'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-500'
              }`}
              onClick={() => setFigi(instrument.figi)}
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
                ${instrument.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Visualization */}
      {marketData && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Market Data for {figi}
          </h3>
          <div className={`h-96 rounded-2xl flex items-center justify-center ${
            isDark ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Advanced charts and market data visualization will be implemented here
            </span>
          </div>
        </div>
      )}
    </div>
  );
}