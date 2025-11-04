// src/components/dashboard/Dashboard.js
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { usePortfolio } from '../../hooks/usePortfolio';
import { marketAPI } from '../../services/api';

const AI_RECOMMENDATIONS = [
  {
    symbol: 'SBER',
    name: 'Сбербанк',
    action: 'buy',
    confidence: 0.87,
    reason: 'Сильный восходящий тренд с поддержкой технических индикаторов',
    predictedReturn: 0.15
  },
  {
    symbol: 'GAZP',
    name: 'Газпром',
    action: 'hold',
    confidence: 0.78,
    reason: 'Стабильная производительность с умеренным ростом',
    predictedReturn: 0.05
  },
  {
    symbol: 'YNDX',
    name: 'Яндекс',
    action: 'buy',
    confidence: 0.82,
    reason: 'Высокий потенциал роста в технологическом секторе',
    predictedReturn: 0.12
  }
];

const getActionColors = (action, isDark) => {
  const colors = {
    buy: {
      bg: isDark ? 'bg-green-500/10 border-green-500/30' : 'bg-green-50 border-green-200',
      iconBg: isDark ? 'bg-green-500/20' : 'bg-green-100',
      iconColor: 'text-green-600 dark:text-green-400',
      border: 'border-green-500/30'
    },
    sell: {
      bg: isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200',
      iconBg: isDark ? 'bg-red-500/20' : 'bg-red-100',
      iconColor: 'text-red-600 dark:text-red-400',
      border: 'border-red-500/30'
    },
    hold: {
      bg: isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200',
      iconBg: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      border: 'border-yellow-500/30'
    }
  };
  return colors[action] || colors.hold;
};

const getActionIcon = (action) => {
  const icons = {
    buy: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    sell: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    hold: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  };
  return icons[action] || icons.hold;
};

export default function Dashboard() {
  const { portfolioData, loading, error, loadPortfolioData, formatCurrency } = usePortfolio();
  const { isDark } = useTheme();

  const displayPositions = useMemo(() => 
    portfolioData?.positions?.filter(pos => pos.instrument_type === 'share') || [], 
    [portfolioData]
  );

  const dailyChange = useMemo(() => {
    if (!portfolioData?.positions) return { amount: 0, percent: 0 };
    
    const totalChange = portfolioData.positions.reduce((sum, position) => 
      sum + (position.expected_yield || 0), 0);
    
    const totalValue = portfolioData.total_value || 70026.03;
    const percentChange = totalValue > 0 ? (totalChange / totalValue) * 100 : 0;
    
    return { amount: totalChange, percent: percentChange };
  }, [portfolioData]);

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
      {/* Заголовок и метрики */}
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Панель управления</h1>
            <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
              Обзор вашего портфеля и AI рекомендации
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

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Общая стоимость"
          value={`${formatCurrency(portfolioData?.totalValue || 0)} ₽`}
          icon="money"
          isDark={isDark}
          color="green"
        />
        
        <MetricCard
          title="Наличные средства"
          value={`${formatCurrency(portfolioData?.cashBalance || 0)} ₽`}
          icon="cash"
          isDark={isDark}
          color="blue"
        />
        
        <MetricCard
          title="Доходность"
          value={`${dailyChange.percent >= 0 ? '+' : ''}${dailyChange.percent.toFixed(2)}%`}
          icon="chart"
          isDark={isDark}
          color={dailyChange.percent >= 0 ? 'green' : 'red'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Позиции портфеля */}
        <PortfolioPositions 
          positions={displayPositions}
          isDark={isDark}
          formatCurrency={formatCurrency}
        />

        {/* AI рекомендации */}
        <AIRecommendations 
          recommendations={AI_RECOMMENDATIONS}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

// Вынесенные компоненты для лучшей производительности
const MetricCard = React.memo(({ title, value, icon, isDark, color }) => {
  const iconConfig = {
    money: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    cash: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    ),
    chart: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  };

  const colorClasses = {
    green: { bg: isDark ? 'bg-green-500/20' : 'bg-green-100', text: 'text-green-600 dark:text-green-400' },
    blue: { bg: isDark ? 'bg-blue-500/20' : 'bg-blue-100', text: 'text-blue-600 dark:text-blue-400' },
    red: { bg: isDark ? 'bg-red-500/20' : 'bg-red-100', text: 'text-red-600 dark:text-red-400' }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${
            color === 'green' ? 'text-green-600 dark:text-green-400' :
            color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
            'text-red-600 dark:text-red-400'
          }`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${colorClasses[color]?.bg || colorClasses.green.bg}`}>
          <div className={colorClasses[color]?.text || colorClasses.green.text}>
            {iconConfig[icon]}
          </div>
        </div>
      </div>
    </div>
  );
});

const PortfolioPositions = React.memo(({ positions, isDark, formatCurrency }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Акции в портфеле</h3>
      <Link
        to="/portfolio"
        className={`text-sm font-medium transition-colors duration-300 ${
          isDark ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-600 hover:text-blue-700'
        }`}
      >
        Смотреть все
      </Link>
    </div>
    <div className="space-y-4">
      {positions.length > 0 ? (
        positions.map((position, index) => (
          <PortfolioPositionItem 
            key={`${position.figi}-${index}`}
            position={position}
            isDark={isDark}
            formatCurrency={formatCurrency}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Нет акций в портфеле</p>
          <p className="text-sm mt-2">Начните инвестировать, чтобы увидеть свои позиции здесь</p>
        </div>
      )}
    </div>
  </div>
));

const PortfolioPositionItem = React.memo(({ position, isDark, formatCurrency }) => {
  const change = {
    amount: position.profit || 0,
    percent: position.profitPercent || 0
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
          change.percent >= 0 
            ? (isDark ? 'bg-green-500/20' : 'bg-green-100')
            : (isDark ? 'bg-red-500/20' : 'bg-red-100')
        }`}>
          <span className={`font-bold text-sm ${
            change.percent >= 0 
              ? (isDark ? 'text-green-400' : 'text-green-600')
              : (isDark ? 'text-red-400' : 'text-red-600')
          }`}>
            {position.symbol}
          </span>
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-white">{position.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {position.quantity.toLocaleString('ru-RU')} шт
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-800 dark:text-white">
          {formatCurrency(position.marketValue)} ₽
        </p>
        <p className={`text-sm font-medium ${
          change.percent >= 0 
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {change.amount >= 0 ? '+' : ''}{formatCurrency(change.amount)} ₽ 
          ({change.percent >= 0 ? '+' : ''}{change.percent.toFixed(2)}%)
        </p>
      </div>
    </div>
  );
});

const AIRecommendations = React.memo(({ recommendations, isDark }) => (
  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">AI рекомендации</h3>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        Обновлено: {new Date().toLocaleTimeString('ru-RU')}
      </span>
    </div>
    <div className="space-y-4">
      {recommendations.map((recommendation, index) => (
        <RecommendationItem 
          key={`${recommendation.symbol}-${index}`}
          recommendation={recommendation}
          isDark={isDark}
        />
      ))}
    </div>
  </div>
));

const RecommendationItem = React.memo(({ recommendation, isDark }) => {
  const colors = getActionColors(recommendation.action, isDark);
  
  return (
    <div className={`p-4 rounded-2xl border transition-colors duration-300 ${colors.bg} ${colors.border}`}>
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-xl ${colors.iconBg}`}>
          <div className={colors.iconColor}>
            {getActionIcon(recommendation.action)}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-gray-800 dark:text-white">
              {recommendation.action === 'buy' ? 'Покупать' : 
               recommendation.action === 'sell' ? 'Продавать' : 'Держать'}: {recommendation.symbol}
            </p>
            <span className={`text-xs px-2 py-1 rounded-full ${
              isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
            }`}>
              {(recommendation.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {recommendation.reason}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Прогноз: {recommendation.predictedReturn >= 0 ? '+' : ''}{(recommendation.predictedReturn * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
});