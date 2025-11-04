// src/components/portfolio/Portfolio.js
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { usePortfolio } from '../../hooks/usePortfolio';

export default function Portfolio() {
  const { portfolioData, loading, error, loadPortfolioData, formatCurrency } = usePortfolio();
  const { isDark } = useTheme();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${
          isDark ? 'border-cyan-500' : 'border-blue-500'
        }`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Портфель</h1>
            <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
              Детальный обзор ваших инвестиций
            </p>
          </div>
          <button
            onClick={loadPortfolioData}
            className={`px-4 py-2 rounded-2xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-all duration-300 ${
              isDark ? 'hover:shadow-lg' : 'hover:shadow-md'
            }`}
          >
            Обновить
          </button>
        </div>
      </div>

      {error && (
        <div className={`rounded-2xl p-4 border ${
          isDark ? 'bg-red-500/10 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Сводка портфеля */}
      <PortfolioSummary portfolioData={portfolioData} isDark={isDark} formatCurrency={formatCurrency} />
      
      {/* Информация о наличных */}
      <CashBalance cashBalance={portfolioData?.cashBalance} isDark={isDark} formatCurrency={formatCurrency} />
      
      {/* Детали портфеля */}
      <PortfolioDetails positions={portfolioData?.positions} isDark={isDark} formatCurrency={formatCurrency} />
    </div>
  );
}

const PortfolioSummary = React.memo(({ portfolioData, isDark, formatCurrency }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <SummaryCard
      title="Общая стоимость"
      value={`${formatCurrency(portfolioData?.totalValue || 0)} ₽`}
      subtitle="Включая наличные"
      isDark={isDark}
    />
    <SummaryCard
      title="Общая прибыль"
      value={`${portfolioData?.totalProfit >= 0 ? '+' : ''}${formatCurrency(portfolioData?.totalProfit || 0)} ₽`}
      subtitle="По акциям"
      isDark={isDark}
      isProfit
    />
    <SummaryCard
      title="Доходность"
      value={`${portfolioData?.profitPercent >= 0 ? '+' : ''}${(portfolioData?.profitPercent || 0).toFixed(2)}%`}
      subtitle="По акциям"
      isDark={isDark}
      isProfit
    />
    <SummaryCard
      title="Акций в портфеле"
      value={portfolioData?.positionsCount || 0}
      subtitle="Позиции"
      isDark={isDark}
    />
  </div>
));

const SummaryCard = React.memo(({ title, value, subtitle, isDark, isProfit }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
    <p className={`text-2xl font-bold mt-1 ${
      isProfit 
        ? (typeof value === 'string' && value.includes('+')
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400')
        : 'text-gray-900 dark:text-white'
    }`}>
      {value}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
  </div>
));

const CashBalance = React.memo(({ cashBalance, isDark, formatCurrency }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Наличные средства</h3>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(cashBalance || 0)} ₽
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Доступно для инвестиций
        </p>
      </div>
      <div className={`p-3 rounded-2xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
        <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      </div>
    </div>
  </div>
));

const PortfolioDetails = React.memo(({ positions, isDark, formatCurrency }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Акции в портфеле</h3>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Обновлено: {new Date().toLocaleTimeString('ru-RU')}
      </span>
    </div>
    <div className="overflow-x-auto">
      {positions && positions.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr className={`border-b border-gray-200 dark:border-gray-700 ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Актив</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Количество</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Средняя цена</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Текущая цена</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Рыночная стоимость</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Прибыль</th>
              <th className="text-left py-4 px-6 text-sm font-medium text-gray-600 dark:text-gray-400">Сектор</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <PortfolioRow 
                key={`${position.figi}-${index}`}
                position={position}
                isDark={isDark}
                formatCurrency={formatCurrency}
              />
            ))}
          </tbody>
        </table>
      ) : (
        <EmptyPortfolio isDark={isDark} />
      )}
    </div>
  </div>
));

const PortfolioRow = React.memo(({ position, isDark, formatCurrency }) => (
  <tr className={`border-b border-gray-200 dark:border-gray-700 hover:${
    isDark ? 'bg-gray-700/30' : 'bg-gray-50'
  } transition-colors duration-200`}>
    <td className="py-4 px-6">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
          position.profit >= 0 
            ? (isDark ? 'bg-green-500/20' : 'bg-green-100')
            : (isDark ? 'bg-red-500/20' : 'bg-red-100')
        }`}>
          <span className={`font-bold text-sm ${
            position.profit >= 0 
              ? (isDark ? 'text-green-400' : 'text-green-600')
              : (isDark ? 'text-red-400' : 'text-red-600')
          }`}>
            {position.symbol}
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">{position.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{position.symbol}</p>
        </div>
      </div>
    </td>
    <td className="py-4 px-6 text-gray-800 dark:text-white">
      {position.quantity.toLocaleString('ru-RU')} шт
    </td>
    <td className="py-4 px-6 text-gray-800 dark:text-white">
      {formatCurrency(position.avgPrice)} ₽
    </td>
    <td className="py-4 px-6 text-gray-800 dark:text-white">
      {formatCurrency(position.currentPrice)} ₽
    </td>
    <td className="py-4 px-6 text-gray-800 dark:text-white">
      {formatCurrency(position.marketValue)} ₽
    </td>
    <td className="py-4 px-6">
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        position.profit >= 0
          ? (isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700')
          : (isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700')
      }`}>
        {position.profit >= 0 ? '+' : ''}{formatCurrency(position.profit)} ₽
        <span className="ml-1">
          ({position.profitPercent >= 0 ? '+' : ''}{position.profitPercent.toFixed(2)}%)
        </span>
      </div>
    </td>
    <td className="py-4 px-6">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
      }`}>
        {position.sector}
      </span>
    </td>
  </tr>
));

const EmptyPortfolio = React.memo(({ isDark }) => (
  <div className="text-center py-12">
    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
      isDark ? 'bg-gray-700' : 'bg-gray-100'
    }`}>
      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    </div>
    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Портфель пуст</h4>
    <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
      Начните инвестировать, чтобы увидеть свои позиции здесь. 
      Используйте раздел "Торговля" для покупки акций.
    </p>
  </div>
));