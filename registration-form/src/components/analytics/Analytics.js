// src/components/analytics/Analytics.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Analytics() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Analytics</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Advanced analytics and performance metrics
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-700 dark:text-gray-300">Total Return</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">+24.5%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-700 dark:text-gray-300">Sharpe Ratio</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">1.8</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-2xl">
              <span className="text-gray-700 dark:text-gray-300">Max Drawdown</span>
              <span className="text-red-600 dark:text-red-400 font-semibold">-8.2%</span>
            </div>
          </div>
        </div>

        {/* Model Accuracy */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Model Accuracy
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">SVR Model</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '84%'}}></div>
                </div>
                <span className="text-green-600 dark:text-green-400 font-semibold">84%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">GPR Model</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '79%'}}></div>
                </div>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">79%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Adaptive Model</span>
              <div className="flex items-center">
                <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '87%'}}></div>
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-semibold">87%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Performance Charts
        </h3>
        <div className={`h-64 rounded-2xl flex items-center justify-center ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Charts and visualizations will be implemented here
          </span>
        </div>
      </div>
    </div>
  );
}