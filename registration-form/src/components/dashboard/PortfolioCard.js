// src/components/dashboard/PortfolioCard.js
import React, { useState, useEffect } from 'react';
import { tradeAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import { useTheme } from '../../contexts/ThemeContext';

export default function PortfolioCard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await tradeAPI.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transition-colors duration-300">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 backdrop-blur-sm transition-colors duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
          Portfolio Overview
        </h2>
        <button 
          onClick={loadPortfolio}
          className={`px-4 py-2 rounded-2xl text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-r from-green-500 to-cyan-600 hover:from-green-600 hover:to-cyan-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border-blue-700'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200'
        }`}>
          <div className={`text-sm font-semibold transition-colors duration-300 ${
            isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>Total Value</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            ${portfolio?.total_value?.toFixed(2) || '0.00'}
          </div>
          <div className="text-green-600 dark:text-green-400 text-sm mt-2 transition-colors duration-300">
            +2.3% Today
          </div>
        </div>

        <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700'
            : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-200'
        }`}>
          <div className={`text-sm font-semibold transition-colors duration-300 ${
            isDark ? 'text-green-400' : 'text-green-600'
          }`}>Cash Balance</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            ${portfolio?.cash_balance?.toFixed(2) || '0.00'}
          </div>
          <div className={`text-sm mt-2 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Available</div>
        </div>

        <div className={`rounded-2xl p-4 border transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-purple-900/50 to-violet-900/50 border-purple-700'
            : 'bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200'
        }`}>
          <div className={`text-sm font-semibold transition-colors duration-300 ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>Positions</div>
          <div className="text-3xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            {portfolio?.positions_count || 0}
          </div>
          <div className={`text-sm mt-2 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>Active</div>
        </div>
      </div>

      {/* Recent Positions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          Recent Positions
        </h3>
        <div className="space-y-3">
          {portfolio?.positions?.slice(0, 3).map((position, index) => (
            <div key={index} className={`flex justify-between items-center p-3 rounded-2xl transition-colors duration-300 ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div>
                <div className="font-medium text-gray-800 dark:text-white transition-colors duration-300">
                  {position.figi}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {position.quantity} shares
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800 dark:text-white transition-colors duration-300">
                  ${position.value?.toFixed(2)}
                </div>
                <div className={`text-sm ${
                  position.change >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                } transition-colors duration-300`}>
                  {position.change >= 0 ? '+' : ''}{position.change}%
                </div>
              </div>
            </div>
          )) || (
            <div className={`text-center py-4 transition-colors duration-300 ${
              isDark ? 'text-gray-500' : 'text-gray-500'
            }`}>
              No active positions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}