// src/components/portfolio/Portfolio.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { usePortfolio } from '../../hooks/usePortfolio';
import { tradeAPI } from '../../services/api';

export default function Portfolio() {
  const { portfolioData, loading, error, loadPortfolioData, formatCurrency } = usePortfolio();
  const { isDark } = useTheme();
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxMessage, setSandboxMessage] = useState('');
  const [userAccounts, setUserAccounts] = useState([]);
  const [showAccountSelection, setShowAccountSelection] = useState(false);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [showCreateAccountConfirm, setShowCreateAccountConfirm] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [amount, setAmount] = useState('100000');

  // Загружаем список счетов при монтировании компонента
  useEffect(() => {
    loadUserAccounts();
  }, []);

  const loadUserAccounts = async () => {
    setAccountsLoading(true);
    try {
      console.log('Загрузка счетов...');
      const response = await tradeAPI.getAccounts();
      console.log('Ответ от API:', response);
      console.log('Данные счетов:', response.data);
      
      const accounts = response.data.accounts || [];
      console.log('Массив счетов:', accounts);
      
      setUserAccounts(accounts);
      console.log('Установлены счета:', accounts);
      
    } catch (error) {
      console.error('Ошибка загрузки счетов:', error);
      console.error('Детали ошибки:', error.response?.data);
      setUserAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  const handleOpenSandboxAccount = async () => {
    setSandboxLoading(true);
    setSandboxMessage('');
    try {
      const response = await tradeAPI.openSandboxAccount("ACCOUNT_TYPE_TINKOFF");
      setSandboxMessage(`✅ ${response.data.message || 'Счет в песочнице успешно создан!'}`);
      
      // Обновляем список счетов и портфеля
      setTimeout(() => {
        loadUserAccounts();
        loadPortfolioData();
      }, 1000);
    } catch (error) {
      console.error('Ошибка создания счета:', error);
      const errorDetail = error.response?.data?.detail;
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.detail;
        setSandboxMessage(`❌ Ошибка валидации: ${JSON.stringify(validationErrors)}`);
      } else if (errorDetail && errorDetail.includes('already exists')) {
        setSandboxMessage('ℹ️ У вас уже есть открытый счет в песочнице');
      } else {
        setSandboxMessage(`❌ ${errorDetail || 'Ошибка создания счета в песочнице'}`);
      }
    } finally {
      setSandboxLoading(false);
    }
  };

  const handleSandboxPayIn = async () => {
    // Если нет счетов, предлагаем создать новый
    if (!userAccounts || userAccounts.length === 0) {
      setShowCreateAccountConfirm(true);
      return;
    }

    if (userAccounts.length === 1) {
      // Если счет только один, сразу запрашиваем сумму
      setSelectedAccountId(userAccounts[0].id);
      setShowAmountInput(true);
    } else {
      // Если несколько счетов, показываем выбор
      setShowAccountSelection(true);
    }
  };

  const handleAccountSelect = async (accountId) => {
    setShowAccountSelection(false);
    setSelectedAccountId(accountId);
    setShowAmountInput(true);
  };

  const handleConfirmCreateAccount = async () => {
    setShowCreateAccountConfirm(false);
    await handleOpenSandboxAccount();
  };

  const handleConfirmAmount = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setSandboxMessage('❌ Введите корректную сумму');
      setShowAmountInput(false);
      return;
    }
    
    setShowAmountInput(false);
    await processPayIn(selectedAccountId, parseFloat(amount));
  };

  const processPayIn = async (accountId, amount) => {
    setSandboxLoading(true);
    setSandboxMessage('');
    try {
      // Теперь передаем accountId в метод sandboxPayIn
      const response = await tradeAPI.sandboxPayIn(accountId, amount, "RUB");
      setSandboxMessage(`✅ ${response.data.message || `Счет пополнен на ${amount} рублей!`}`);
      
      // Перезагружаем данные портфеля
      setTimeout(() => loadPortfolioData(), 1000);
    } catch (error) {
      console.error('Ошибка пополнения счета:', error);
      const errorDetail = error.response?.data?.detail;
      
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.detail;
        setSandboxMessage(`❌ Ошибка валидации: ${JSON.stringify(validationErrors)}`);
      } else {
        setSandboxMessage(`❌ ${errorDetail || 'Ошибка пополнения счета'}`);
      }
    } finally {
      setSandboxLoading(false);
    }
  };

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
      {/* Модальное окно подтверждения создания счета */}
      {showCreateAccountConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-3xl p-6 max-w-md w-full mx-4 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Создание счета
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              У вас нет открытых счетов. Хотите создать счет в песочнице?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmCreateAccount}
                className={`flex-1 py-3 rounded-2xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${
                  isDark ? 'hover:shadow-lg' : 'hover:shadow-md'
                }`}
              >
                Создать счет
              </button>
              <button
                onClick={() => setShowCreateAccountConfirm(false)}
                className={`flex-1 py-3 rounded-2xl font-medium ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно ввода суммы */}
      {showAmountInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-3xl p-6 max-w-md w-full mx-4 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Пополнение счета
            </h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Введите сумму пополнения (рубли):
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full px-4 py-3 rounded-2xl border ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="100000"
                min="1"
                step="1000"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmAmount}
                className={`flex-1 py-3 rounded-2xl font-semibold text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${
                  isDark ? 'hover:shadow-lg' : 'hover:shadow-md'
                }`}
              >
                Пополнить
              </button>
              <button
                onClick={() => setShowAmountInput(false)}
                className={`flex-1 py-3 rounded-2xl font-medium ${
                  isDark 
                    ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                }`}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно выбора счета */}
      {showAccountSelection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-3xl p-6 max-w-md w-full mx-4 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Выберите счет для пополнения
            </h3>
            <div className="space-y-3">
              {userAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleAccountSelect(account.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all duration-200 ${
                    isDark 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="font-medium">Счет: {account.id}</div>
                  <div className="text-sm opacity-70">
                    Тип: {account.type || 'Песочница'}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowAccountSelection(false)}
              className={`w-full mt-4 py-2 rounded-2xl font-medium ${
                isDark 
                  ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

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
          <div className="flex space-x-3">
            <button
              onClick={handleOpenSandboxAccount}
              disabled={sandboxLoading}
              className={`px-4 py-2 rounded-2xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-all duration-300 disabled:opacity-50 ${
                isDark ? 'hover:shadow-lg' : 'hover:shadow-md'
              }`}
            >
              {sandboxLoading ? 'Создание...' : 'Создать счет'}
            </button>
            <button
              onClick={handleSandboxPayIn}
              disabled={sandboxLoading}
              className={`px-4 py-2 rounded-2xl font-semibold text-white bg-white/20 hover:bg-white/30 transition-all duration-300 disabled:opacity-50 ${
                isDark ? 'hover:shadow-lg' : 'hover:shadow-md'
              }`}
            >
              {sandboxLoading ? 'Пополнение...' : 'Пополнить счет'}
            </button>
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
      </div>

      {/* Информация о доступных счетах */}
      {!accountsLoading && userAccounts.length > 0 && (
        <div className={`rounded-2xl p-4 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'
        }`}>
          <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">
            Доступные счета ({userAccounts.length})
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            {userAccounts.map(account => (
              <div key={account.id} className="flex items-center space-x-2">
                <span className="text-xs">•</span>
                <span>ID: {account.id.slice(0, 8)}...</span>
                <span className="opacity-70">({account.type || 'Песочница'})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!accountsLoading && userAccounts.length === 0 && (
        <div className={`rounded-2xl p-4 ${
          isDark ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <p className="text-yellow-700 dark:text-yellow-300">
            Нет доступных счетов. Создайте счет в песочнице, чтобы начать работу.
          </p>
        </div>
      )}

      {accountsLoading && (
        <div className={`rounded-2xl p-4 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
        }`}>
          <div className="flex items-center justify-center">
            <div className={`animate-spin rounded-full h-5 w-5 border-b-2 mr-3 ${
              isDark ? 'border-cyan-500' : 'border-blue-500'
            }`}></div>
            <p className="text-gray-600 dark:text-gray-300">Загрузка информации о счетах...</p>
          </div>
        </div>
      )}

      {sandboxMessage && (
        <div className={`p-4 rounded-2xl ${
          sandboxMessage.includes('❌') || sandboxMessage.includes('Ошибка')
            ? 'bg-red-100 border border-red-300 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
            : sandboxMessage.includes('ℹ️')
            ? 'bg-blue-100 border border-blue-300 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200'
            : 'bg-green-100 border border-green-300 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200'
        }`}>
          {sandboxMessage}
        </div>
      )}

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

      {/* Остальной код компонента */}
      <PortfolioSummary portfolioData={portfolioData} isDark={isDark} formatCurrency={formatCurrency} />
      <CashBalance cashBalance={portfolioData?.cashBalance} isDark={isDark} formatCurrency={formatCurrency} />
      <PortfolioDetails positions={portfolioData?.positions} isDark={isDark} formatCurrency={formatCurrency} />
    </div>
  );
}

// Остальные компоненты остаются без изменений...
// PortfolioSummary, SummaryCard, CashBalance, PortfolioDetails, PortfolioRow, EmptyPortfolio
// ... (они остаются такими же как в предыдущем коде)
// Остальные компоненты (PortfolioSummary, SummaryCard, CashBalance, PortfolioDetails, PortfolioRow, EmptyPortfolio) 
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