// src/components/layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function Sidebar() {
  const location = useLocation();
  const { isDark } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trading', label: 'Trading', icon: '💹' },
    { path: '/portfolio', label: 'Portfolio', icon: '💰' },
    { path: '/market', label: 'Market Data', icon: '📈' },
    { path: '/models', label: 'AI Models', icon: '🤖' },
    { path: '/backtest', label: 'Backtesting', icon: '🔍' },
    { path: '/analytics', label: 'Analytics', icon: '📋' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-16 h-full w-64 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? isDark
                      ? 'bg-gradient-to-r from-green-500 to-cyan-600 text-white shadow-lg transform -translate-y-0.5'
                      : 'bg-gradient-to-r from-pink-500 to-blue-500 text-white shadow-lg transform -translate-y-0.5'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-md'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className={`rounded-2xl p-4 border backdrop-blur-sm transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200'
        }`}>
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-200' : 'text-gray-700'
          }`}>Trading Status</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}