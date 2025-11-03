// src/components/portfolio/Portfolio.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Portfolio() {
  const { isDark } = useTheme();

  const portfolioData = {
    totalValue: 125430.50,
    cashBalance: 25430.50,
    positions: [
      { symbol: 'AAPL', shares: 50, avgPrice: 150.25, currentPrice: 182.63, value: 9131.50 },
      { symbol: 'GOOGL', shares: 10, avgPrice: 125.80, currentPrice: 138.21, value: 1382.10 },
      { symbol: 'TSLA', shares: 25, avgPrice: 210.45, currentPrice: 234.72, value: 5868.00 },
      { symbol: 'BTC-USD', shares: 0.5, avgPrice: 38500.00, currentPrice: 43256.78, value: 21628.39 },
    ]
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Portfolio Management</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Comprehensive portfolio analysis and management
        </p>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-6 border ${
          isDark
            ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200'
        }`}>
          <div className={`text-sm font-semibold ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>Total Portfolio Value</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            ${portfolioData.totalValue.toLocaleString()}
          </div>
          <div className="text-green-600 dark:text-green-400 text-sm mt-2">+12.4% All Time</div>
        </div>

        <div className={`rounded-2xl p-6 border ${
          isDark
            ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700'
            : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'
        }`}>
          <div className={`text-sm font-semibold ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>Cash Balance</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            ${portfolioData.cashBalance.toLocaleString()}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">Available</div>
        </div>

        <div className={`rounded-2xl p-6 border ${
          isDark
            ? 'bg-gradient-to-br from-purple-900/50 to-violet-900/50 border-purple-700'
            : 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200'
        }`}>
          <div className={`text-sm font-semibold ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>Active Positions</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white">
            {portfolioData.positions.length}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">Holdings</div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Current Positions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Symbol</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Shares</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Avg Price</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Current Price</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">Value</th>
                <th className="text-left py-3 px-4 text-gray-700 dark:text-gray-300">P&L</th>
              </tr>
            </thead>
            <tbody>
              {portfolioData.positions.map((position, index) => {
                const profitLoss = ((position.currentPrice - position.avgPrice) * position.shares);
                const profitLossPercent = ((position.currentPrice / position.avgPrice - 1) * 100);
                
                return (
                  <tr key={index} className={`border-b ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  }`}>
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-white">
                      {position.symbol}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {position.shares}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      ${position.avgPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      ${position.currentPrice.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      ${position.value.toLocaleString()}
                    </td>
                    <td className={`py-3 px-4 font-semibold ${
                      profitLoss >= 0 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}