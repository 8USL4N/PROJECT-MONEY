// src/components/backtest/Backtest.js
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Backtest() {
  const [backtestConfig, setBacktestConfig] = useState({
    model: 'svr',
    asset: 'SBER',
    period: '6m',
    initialCapital: 10000,
    commission: 0.1
  });
  const { isDark } = useTheme();

  const handleRunBacktest = async () => {
    // Здесь будет интеграция с API бэктестинга
    alert('Функционал бэктестинга будет реализован с API бэкенда');
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">Бэктестинг</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Тестируйте ваши торговые стратегии на исторических данных
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Панель конфигурации */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Конфигурация бэктестинга
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  AI Модель
                </label>
                <select
                  value={backtestConfig.model}
                  onChange={(e) => setBacktestConfig({...backtestConfig, model: e.target.value})}
                  className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                      : 'border border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="svr">SVR с RBF ядром</option>
                  <option value="gpr">GPR с Matérn ядром</option>
                  <option value="adaptive">Адаптивная модель</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Актив
                </label>
                <select
                  value={backtestConfig.asset}
                  onChange={(e) => setBacktestConfig({...backtestConfig, asset: e.target.value})}
                  className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                      : 'border border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="SBER">Сбербанк (SBER)</option>
                  <option value="GAZP">Газпром (GAZP)</option>
                  <option value="LKOH">Лукойл (LKOH)</option>
                  <option value="YNDX">Яндекс (YNDX)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Период
                </label>
                <select
                  value={backtestConfig.period}
                  onChange={(e) => setBacktestConfig({...backtestConfig, period: e.target.value})}
                  className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                      : 'border border-gray-300 focus:ring-blue-500'
                  }`}
                >
                  <option value="1m">1 месяц</option>
                  <option value="3m">3 месяца</option>
                  <option value="6m">6 месяцев</option>
                  <option value="1y">1 год</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Начальный капитал (₽)
                </label>
                <input
                  type="number"
                  value={backtestConfig.initialCapital}
                  onChange={(e) => setBacktestConfig({...backtestConfig, initialCapital: parseInt(e.target.value)})}
                  className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                      : 'border border-gray-300 focus:ring-blue-500'
                  }`}
                />
              </div>

              <button
                onClick={handleRunBacktest}
                className={`w-full py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                  isDark
                    ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                Запустить бэктест
              </button>
            </div>
          </div>
        </div>

        {/* Панель результатов */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Результаты бэктестинга
            </h3>
            <div className={`h-96 rounded-2xl flex items-center justify-center ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Результаты бэктестинга и графики производительности появятся здесь
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}