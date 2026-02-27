// src/components/layout/Header.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50 transition-colors duration-300">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          {/* Левая часть - Логотип и название */}
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isDark 
                ? 'bg-gradient-to-r from-green-400 to-cyan-500' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600'
            } shadow-lg`}>
              <span className="text-white font-bold text-lg">₿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                УмныйТрейдер
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                AI-платформа для инвестиций
              </p>
            </div>
          </div>
          
          {/* Правая часть - Пользователь и управление */}
          <div className="flex items-center space-x-3">
            {/* Переключатель темы */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'bg-gray-700 text-cyan-400 hover:bg-gray-600' 
                  : 'bg-gray-100 text-blue-600 hover:bg-gray-200'
              } shadow-lg hover:shadow-xl transform hover:scale-110`}
              title={isDark ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
            >
              {isDark ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Информация о пользователе */}
            <div className="text-right border-r border-gray-200 dark:border-gray-700 pr-3">
              <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                {currentUser?.username || 'Трейдер'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">
                {currentUser?.email || 'investor@example.com'}
              </p>
            </div>
            
            {/* Кнопка выхода */}
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                isDark
                  ? 'bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700'
                  : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
              }`}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}