// src/components/dashboard/Dashboard.js
import React from 'react';
import PortfolioCard from './PortfolioCard';
import TradingPanel from './TradingPanel';
import MarketData from './MarketData';
import { useTheme } from '../../contexts/ThemeContext';

export default function Dashboard() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`rounded-3xl p-8 text-white shadow-2xl transition-all duration-300 ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Welcome to QuantumTrade</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          AI-powered trading platform with real-time analytics and predictive models
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <PortfolioCard />
          <MarketData />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TradingPanel />
          
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transition-colors duration-300">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className={`w-full text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
                  : 'bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700'
              }`}>
                Train AI Model
              </button>
              <button className={`w-full text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                  : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
              }`}>
                Run Backtest
              </button>
              <button className={`w-full text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
              }`}>
                Market Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transition-colors duration-300">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          AI Trading Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700'
              : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'
          }`}>
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>SVR Model</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">84%</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Accuracy</div>
          </div>
          <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-blue-900/50 to-cyan-900/50 border-blue-700'
              : 'bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200'
          }`}>
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>GPR Model</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">79%</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Accuracy</div>
          </div>
          <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
            isDark
              ? 'bg-gradient-to-br from-purple-900/50 to-violet-900/50 border-purple-700'
              : 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200'
          }`}>
            <div className={`text-sm font-semibold transition-colors duration-300 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`}>Signal Strength</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Strong</div>
            <div className={`text-xs transition-colors duration-300 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Bullish Trend</div>
          </div>
        </div>
      </div>
    </div>
  );
}