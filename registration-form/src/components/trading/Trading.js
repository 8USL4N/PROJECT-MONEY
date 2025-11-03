// src/components/trading/Trading.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Trading() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Trading Platform</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Advanced trading interface with real-time execution
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Place Order
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Symbol
                </label>
                <input
                  type="text"
                  placeholder="AAPL"
                  className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                      : 'border border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button className={`py-3 rounded-2xl font-semibold text-white ${
                  isDark
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-green-500 hover:bg-green-600'
                } transition-all duration-300`}>
                  Buy
                </button>
                <button className={`py-3 rounded-2xl font-semibold text-white ${
                  isDark
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-500 hover:bg-red-600'
                } transition-all duration-300`}>
                  Sell
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Panel */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Trading Chart
            </h3>
            <div className={`h-96 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Real-time trading charts will be implemented here
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}