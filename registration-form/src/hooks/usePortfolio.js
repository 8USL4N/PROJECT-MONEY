// src/hooks/usePortfolio.js
import { useState, useCallback, useMemo, useEffect } from 'react';
import { tradeAPI } from '../services/api';

const INSTRUMENT_NAMES = {
  'BBG004730N88': 'Сбербанк',
  'BBG004730RP0': 'Газпром',
  'BBG00475JZZ6': 'Лукойл',
  'BBG006L8G4H1': 'Яндекс',
  'BBG004S681W1': 'ВТБ',
  'BBG00475K2X9': 'Роснефть',
  'BBG004RVFCY3': 'Магнит',
  'BBG004S683W7': 'Татнефть',
  'BBG004S68B31': 'АЛРОСА',
  'RUB000UTSTOM': 'Наличные рубли'
};

const INSTRUMENT_SECTORS = {
  'BBG004730N88': 'Финансы',
  'BBG004730RP0': 'Энергетика',
  'BBG00475JZZ6': 'Энергетика',
  'BBG006L8G4H1': 'Технологии',
  'BBG004S681W1': 'Финансы',
  'BBG00475K2X9': 'Энергетика',
  'BBG004RVFCY3': 'Потребительские товары',
  'BBG004S683W7': 'Энергетика',
  'BBG004S68B31': 'Добыча',
  'RUB000UTSTOM': 'Деньги'
};

// Запасные данные для демонстрации
const FALLBACK_PORTFOLIO_DATA = {
  totalValue: 70026.03,
  cashBalance: 68441.23,
  totalStocksValue: 1584.8,
  totalProfit: 0,
  profitPercent: 0,
  positionsCount: 1,
  positions: [
    { 
      figi: "BBG004S68B31",
      symbol: 'ALRS', 
      name: 'АЛРОСА', 
      quantity: 40, 
      avgPrice: 39.62, 
      currentPrice: 39.62, 
      marketValue: 1584.8, 
      costBasis: 1584.8, 
      profit: 0, 
      profitPercent: 0,
      sector: 'Добыча',
      instrument_type: 'share',
      currency: 'RUB'
    }
  ]
};

export const usePortfolio = (autoLoad = true) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(autoLoad); // Начинаем с loading=true если autoLoad
  const [error, setError] = useState(null);

  const processPortfolioData = useCallback((apiData) => {
    const stockPositions = apiData.positions?.filter(pos => pos.instrument_type === 'share') || [];
    
    const totals = stockPositions.reduce((acc, position) => {
      const profit = position.expected_yield || 0;
      const value = position.value || 0;
      
      return {
        totalProfit: acc.totalProfit + profit,
        totalStocksValue: acc.totalStocksValue + value,
        totalCostBasis: acc.totalCostBasis + (position.price * position.quantity || 0)
      };
    }, { totalProfit: 0, totalStocksValue: 0, totalCostBasis: 0 });

    const profitPercent = totals.totalCostBasis > 0 ? 
      (totals.totalProfit / totals.totalCostBasis) * 100 : 0;

    const processedPositions = stockPositions.map(position => {
      const quantity = position.quantity || 0;
      const currentPrice = position.price || 0;
      const marketValue = position.value || 0;
      const profit = position.expected_yield || 0;
      const avgPrice = quantity > 0 ? (marketValue - profit) / quantity : 0;
      const costBasis = avgPrice * quantity;
      const profitPercent = costBasis > 0 ? (profit / costBasis) * 100 : 0;

      return {
        figi: position.figi,
        symbol: position.ticker,
        name: INSTRUMENT_NAMES[position.figi] || position.ticker,
        quantity,
        avgPrice,
        currentPrice,
        marketValue,
        costBasis,
        profit,
        profitPercent,
        sector: INSTRUMENT_SECTORS[position.figi] || 'Другое',
        instrument_type: position.instrument_type,
        currency: position.currency
      };
    });

    return {
      totalValue: apiData.total_value || 0,
      cashBalance: apiData.cash_balance || 0,
      totalStocksValue: totals.totalStocksValue,
      totalProfit: totals.totalProfit,
      profitPercent,
      positionsCount: stockPositions.length,
      positions: processedPositions
    };
  }, []);

  const loadPortfolioData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tradeAPI.getPortfolio();
      const processedData = processPortfolioData(response.data);
      setPortfolioData(processedData);
      
    } catch (err) {
      console.error('Ошибка загрузки портфеля:', err);
      setError('Не удалось загрузить данные портфеля');
      // Устанавливаем запасные данные при ошибке
      setPortfolioData(FALLBACK_PORTFOLIO_DATA);
    } finally {
      setLoading(false);
    }
  }, [processPortfolioData]);

  // Автоматическая загрузка при монтировании
  useEffect(() => {
    if (autoLoad) {
      loadPortfolioData();
    }
  }, [autoLoad, loadPortfolioData]);

  const memoizedData = useMemo(() => portfolioData, [portfolioData]);

  return {
    portfolioData: memoizedData,
    loading,
    error,
    loadPortfolioData,
    formatCurrency: (value) => value.toLocaleString('ru-RU', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })
  };
};