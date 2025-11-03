// src/components/dashboard/MarketData.js
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
      const response = await marketAPI.loadCandles(figi, 7);
      setMarketData(response.data);
    } catch (error) {
      console.error('Error loading market data:', error);
      alert('Error loading market data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Market Data
        </h2>
        <div className="flex space-x-3">
          <input
            type="text"
            value={figi}
            onChange={(e) => setFigi(e.target.value)}
            placeholder="Enter FIGI"
            className={`border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
              isDark
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          <button
            onClick={loadMarketData}
            disabled={loading}
            className={`px-4 py-2 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 ${
              isDark
                ? 'bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            }`}
          >
            {loading ? 'Loading...' : 'Load'}
          </button>
        </div>
      </div>

      {marketData && (
        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200'
        }`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-sm font-semibold transition-colors duration-300 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>Candles Loaded</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                {marketData.candles_saved}
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold transition-colors duration-300 ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>Status</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                {marketData.status}
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold transition-colors duration-300 ${
                isDark ? 'text-purple-400' : 'text-purple-600'
              }`}>FIGI</div>
              <div className="text-lg font-bold text-gray-800 dark:text-white truncate transition-colors duration-300">
                {figi}
              </div>
            </div>
            <div>
              <div className={`text-sm font-semibold transition-colors duration-300 ${
                isDark ? 'text-orange-400' : 'text-orange-600'
              }`}>Period</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                7 days
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Chart Placeholder */}
      <div className={`mt-6 rounded-2xl p-8 text-center transition-colors duration-300 ${
        isDark ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <div className={`mb-4 transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>Price Chart Visualization</div>
        <div className={`h-48 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-b from-gray-600 to-gray-700'
            : 'bg-gradient-to-b from-gray-100 to-gray-200'
        }`}>
          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
            Chart will appear here
          </span>
        </div>
      </div>

      {/* Popular Instruments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Popular Instruments
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { figi: 'BBG000B9XRY4', name: 'Apple', change: '+1.2%' },
            { figi: 'BBG000BVPV84', name: 'Google', change: '+0.8%' },
            { figi: 'BBG006L8G4H4', name: 'Tesla', change: '-0.5%' },
            { figi: 'BBG000C2P3G6', name: 'Amazon', change: '+1.5%' },
          ].map((stock, index) => (
            <button
              key={index}
              onClick={() => setFigi(stock.figi)}
              className={`rounded-2xl p-3 text-center transition-all duration-300 ${
                isDark
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium text-gray-800 dark:text-white transition-colors duration-300">
                {stock.name}
              </div>
              <div className={`text-sm ${
                stock.change.includes('+') 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              } transition-colors duration-300`}>
                {stock.change}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}