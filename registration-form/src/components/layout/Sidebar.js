// src/components/layout/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

export default function Sidebar() {
  const location = useLocation();
  const { isDark } = useTheme();

  const menuItems = [
    { path: '/dashboard', label: 'Панель управления', icon: '📊' },
    { path: '/trading', label: 'Торговля', icon: '💹' },
    { path: '/portfolio', label: 'Портфель', icon: '💰' },
    { path: '/market', label: 'Рыночные данные', icon: '📈' },
    { path: '/models', label: 'AI Модели', icon: '🤖' },
    { path: '/backtest', label: 'Бэктестинг', icon: '🔍' },
    { path: '/analytics', label: 'Аналитика', icon: '📋' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 overflow-y-auto">
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? isDark
                      ? 'bg-gradient-to-r from-green-500 to-cyan-600 text-white shadow-lg transform -translate-y-0.5'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
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

      {/* Панель статуса */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className={`rounded-2xl p-4 border transition-all duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600'
            : 'bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <p className={`text-sm font-semibold ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>Статус системы</p>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className={`text-xs font-medium ${
                isDark ? 'text-green-400' : 'text-green-600'
              }`}>Активно</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`text-center rounded-lg py-1 ${
              isDark ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>Модели</div>
              <div className="font-bold text-green-600 dark:text-green-400">3/3</div>
            </div>
            <div className={`text-center rounded-lg py-1 ${
              isDark ? 'bg-gray-600' : 'bg-gray-200'
            }`}>
              <div className={isDark ? 'text-gray-300' : 'text-gray-600'}>API</div>
              <div className="font-bold text-green-600 dark:text-green-400">Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}