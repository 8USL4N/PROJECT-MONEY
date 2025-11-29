// components/Models/Models.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { modelAPI, marketAPI } from '../../services/api';

export default function Models() {
  const [activeTab, setActiveTab] = useState('adaptive');
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [userCandles, setUserCandles] = useState([]); // Новое состояние для списка FIGI пользователя

  const [currentDataInfo, setCurrentDataInfo] = useState({
    figi: 'BBG004730N88', // SBER
    days: 1,
    symbol: 'SBER'
  });

  const [modelParams, setModelParams] = useState({
    svr: { C: 1.0, epsilon: 0.1, gamma: 'scale' },
    gpr: { nu: 1.5, length_scale: 1.0 },
    adaptive: { volatility_threshold: 0.8, lags: 10 }
  });

  const { isDark } = useTheme();

  const modelConfigs = {
    adaptive: {
      name: 'Адаптивная RKHS',
      kernel: 'Гибрид (RBF + Matérn)',
      description: 'Переключается между SVR и GPR в зависимости от волатильности рынка.',
      parameters: [
        { name: 'volatility_threshold', type: 'number', min: 0.1, max: 5.0, step: 0.1, label: 'Порог волатильности (σ)' },
        { name: 'lags', type: 'number', min: 2, max: 30, step: 1, label: 'Размер окна (лаги)' }
      ]
    },
    svr: {
      name: 'SVR (Опорные векторы)',
      kernel: 'RBF',
      description: 'Базовая модель для стабильных трендов.',
      parameters: [
        { name: 'C', type: 'number', min: 0.1, max: 100, step: 0.1, label: 'Регуляризация (C)' },
        { name: 'epsilon', type: 'number', min: 0.01, max: 1, step: 0.01, label: 'Epsilon' },
        { name: 'gamma', type: 'select', options: ['scale', 'auto'], label: 'Gamma' }
      ]
    },
    gpr: {
      name: 'GPR (Гауссовские процессы)',
      kernel: 'Matérn',
      description: 'Вероятностная модель, устойчивая к шуму.',
      parameters: [
        { name: 'length_scale', type: 'number', min: 0.1, max: 10, step: 0.1, label: 'Length Scale' },
        { name: 'nu', type: 'number', min: 0.5, max: 2.5, step: 0.5, label: 'Nu (Гладкость)' }
      ]
    }
  };

  // Получение исторических свечей
  const loadCandles = async (figi = currentDataInfo.figi, days = currentDataInfo.days) => {
    try {
      setStatusMessage('Загрузка исторических данных...');
      const response = await marketAPI.loadCandles(figi, days);
      const loadedCandles = response.data.candles || [];

      // Исправляем формат времени
      const formattedCandles = loadedCandles.map(candle => ({
        ...candle,
        time: candle.x || candle.time, // Используем поле x если time нет
        c: candle.c || candle.close,
        v: candle.v || candle.volume
      }));

      setCandles(formattedCandles);
      setCurrentDataInfo({ ...currentDataInfo, figi, days });
      setStatusMessage(`Загружено свечей: ${formattedCandles.length}`);

      return formattedCandles;
    } catch (error) {
      console.error('Ошибка загрузки свечей:', error);
      setStatusMessage('❌ Не удалось загрузить свечи');
      return [];
    }
  };

  // Получение списка FIGI пользователя
  const loadUserCandles = async () => {
    try {
      const response = await marketAPI.getUserCandles();
      setUserCandles(response.data.candles_by_figi || []);
    } catch (error) {
      console.error('Ошибка загрузки списка FIGI:', error);
    }
  };

  // Удаление свечей пользователя
  const deleteUserCandles = async (figi) => {
    try {
      await marketAPI.deleteUserCandles(figi);
      setStatusMessage(`✅ Удалены свечи для ${figi}`);
      loadUserCandles(); // Обновляем список

      // Если удаляем текущую FIGI, очищаем таблицу
      if (figi === currentDataInfo.figi) {
        setCandles([]);
      }
    } catch (error) {
      console.error('Ошибка удаления свечей:', error);
      setStatusMessage('❌ Ошибка при удалении свечей');
    }
  };

  // Загрузка данных для ML
  const loadMLData = async (figi, startDate = null, endDate = null) => {
    try {
      const response = await marketAPI.getCandleDataForML(figi, startDate, endDate);
      return response.data.data || [];
    } catch (error) {
      console.error('Ошибка загрузки данных для ML:', error);
      return [];
    }
  };

  const prepareLocalData = (candlesData) => {
    if (!candlesData || candlesData.length < 15) return { X: [], y: [] };

    const X = [];
    const y = [];
    const lookback = 10;

    for (let i = lookback; i < candlesData.length - 1; i++) {
      const features = [];
      for (let j = i - lookback; j < i; j++) {
        const candle = candlesData[j];
        features.push(parseFloat(candle.c));
      }
      X.push(features);
      y.push(parseFloat(candlesData[i + 1].c));
    }
    return { X, y };
  };

  useEffect(() => {
    loadCandles();
    loadUserCandles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const trainModel = async () => {
    try {
      if (candles.length === 0) {
        setStatusMessage('❌ Нет данных. Загрузите свечи.');
        return;
      }

      setLoading(true);
      setStatusMessage('Обучение модели...');
      let response;

      if (activeTab === 'adaptive') {
        const endDate = new Date().toISOString();
        const startDate = new Date(Date.now() - (currentDataInfo.days + 1) * 24 * 60 * 60 * 1000).toISOString();

        const payload = {
          symbol: currentDataInfo.figi,
          start_date: startDate,
          end_date: endDate,
          lags: modelParams.adaptive.lags,
          volatility_threshold: modelParams.adaptive.volatility_threshold,
          svr_params: modelParams.svr,
          gpr_params: modelParams.gpr,
          name: `Adaptive ${new Date().toLocaleTimeString()}`
        };

        console.log("Sending Adaptive Payload:", payload);
        response = await modelAPI.trainAdaptive(payload);

      } else {
        const { X, y } = prepareLocalData(candles);

        if (X.length === 0) throw new Error('Недостаточно данных для обучения');

        const currentParams = modelParams[activeTab];
        const payload = {
            ...currentParams,
            feature_columns: ['close_lags'],
            symbol: currentDataInfo.figi,
            start_date: new Date(Date.now() - currentDataInfo.days * 86400000).toISOString(),
            end_date: new Date().toISOString(),
            X: X,
            y: y
        };

        if (activeTab === 'svr') {
          response = await modelAPI.trainSVR(payload);
        } else if (activeTab === 'gpr') {
          response = await modelAPI.trainGPR(payload);
        }
      }

      const metrics = response.data.metrics;
      setStatusMessage(
        `✅ ${modelConfigs[activeTab].name}: Обучено! ` +
        `MAE: ${metrics?.MAE?.toFixed(4) || 'N/A'} | ` +
        `RMSE: ${metrics?.RMSE?.toFixed(4) || 'N/A'}`
      );

    } catch (error) {
      console.error('Ошибка обучения:', error);
      setStatusMessage(`❌ Ошибка: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateParam = (modelType, paramName, value) => {
    setModelParams(prev => ({
      ...prev,
      [modelType]: {
        ...prev[modelType],
        [paramName]: paramName === 'gamma' ? value : parseFloat(value)
      }
    }));
  };

  // Функция для форматирования времени
  const formatTime = (timeString) => {
    if (!timeString) return 'Invalid Date';

    try {
      const date = new Date(timeString);
      if (isNaN(date.getTime())) return 'Invalid Date';

      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Заголовок */}
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700'
          : 'bg-gradient-to-r from-blue-600 to-indigo-700'
      }`}>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <span>🧠</span> Центр обучения AI
        </h1>
        <p className="opacity-80">
          Настройка гиперпараметров и обучение моделей на реальных рыночных данных.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Левая колонка: Настройки (8 колонок) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-1">
            {/* Вкладки */}
            <div className="flex p-1 space-x-1 overflow-x-auto">
              {Object.keys(modelConfigs).map((modelKey) => (
                <button
                  key={modelKey}
                  onClick={() => setActiveTab(modelKey)}
                  className={`flex-1 min-w-[120px] px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${
                    activeTab === modelKey
                      ? isDark
                        ? 'bg-gray-700 text-cyan-400 shadow-md ring-1 ring-cyan-500/50'
                        : 'bg-white text-blue-600 shadow-md ring-1 ring-blue-100'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {modelConfigs[modelKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Панель параметров */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {modelConfigs[activeTab].name}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    {modelConfigs[activeTab].description}
                </p>
                <div className="mt-3 inline-block px-3 py-1 rounded-lg text-xs font-mono bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300">
                    Kernel: {modelConfigs[activeTab].kernel}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {modelConfigs[activeTab].parameters.map((param) => (
                    <div key={param.name} className="group">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 group-hover:text-cyan-500 transition-colors">
                        {param.label || param.name}
                    </label>
                    {param.type === 'select' ? (
                        <select
                        value={modelParams[activeTab][param.name]}
                        onChange={(e) => updateParam(activeTab, param.name, e.target.value)}
                        className={`w-full rounded-xl px-4 py-3 outline-none transition-all duration-300 border ${
                            isDark
                            ? 'bg-gray-900 border-gray-700 text-white focus:border-cyan-500'
                            : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                        }`}
                        >
                        {param.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    ) : (
                        <div className="relative">
                            <input
                                type="number"
                                value={modelParams[activeTab][param.name]}
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                onChange={(e) => updateParam(activeTab, param.name, e.target.value)}
                                className={`w-full rounded-xl px-4 py-3 outline-none transition-all duration-300 border ${
                                isDark
                                    ? 'bg-gray-900 border-gray-700 text-white focus:border-cyan-500'
                                    : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                                }`}
                            />
                            <div className="absolute right-3 top-3 text-xs text-gray-400 pointer-events-none">
                                {param.step < 1 ? 'float' : 'int'}
                            </div>
                        </div>
                    )}
                    </div>
                ))}
            </div>

            {activeTab === 'adaptive' && (
                <div className={`mt-6 p-4 rounded-xl text-sm border ${
                    isDark ? 'bg-cyan-900/20 border-cyan-800 text-cyan-200' : 'bg-blue-50 border-blue-100 text-blue-700'
                }`}>
                    ℹ️ <b>Примечание:</b> Адаптивная модель использует параметры из вкладок <b>SVR</b> и <b>GPR</b> как под-настройки. Убедитесь, что они настроены корректно.
                </div>
            )}

            {statusMessage && (
                <div className={`mt-6 p-4 rounded-xl flex items-center gap-3 animate-pulse-once ${
                statusMessage.includes('❌')
                    ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200'
                    : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200'
                }`}>
                    {statusMessage}
                </div>
            )}

            <div className="flex gap-4 mt-8">
                <button
                    onClick={trainModel}
                    disabled={loading}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transform active:scale-95 transition-all duration-200 ${
                        loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : isDark
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                    }`}
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Обучение...
                        </span>
                    ) : '🚀 Запустить обучение'}
                </button>
            </div>
          </div>
        </div>

        {/* Правая колонка: Данные (4 колонки) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Список FIGI пользователя */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex justify-between items-center">
              <span>📁 Мои данные</span>
              <button
                onClick={loadUserCandles}
                className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Обновить
              </button>
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {userCandles.map((item, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-sm">{item.figi}</span>
                    <button
                      onClick={() => deleteUserCandles(item.figi)}
                      className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Свечей: {item.candle_count}</div>
                    <div>Период: {item.first_date ? new Date(item.first_date).toLocaleDateString() : 'N/A'} - {item.last_date ? new Date(item.last_date).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentDataInfo({...currentDataInfo, figi: item.figi});
                      loadCandles(item.figi, 1);
                    }}
                    className="w-full mt-2 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 rounded"
                  >
                    Выбрать
                  </button>
                </div>
              ))}
              {userCandles.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  Нет сохраненных данных
                </div>
              )}
            </div>
          </div>

          {/* Таблица свечей */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex justify-between items-center">
              <span>📊 Данные</span>
              <span className="text-xs font-normal bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {currentDataInfo.figi}
              </span>
            </h3>

            <div className="flex gap-2 mb-4">
              <button
                onClick={() => loadCandles(currentDataInfo.figi, 1)}
                className="flex-1 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                1 День
              </button>
              <button
                onClick={() => loadCandles(currentDataInfo.figi, 7)}
                className="flex-1 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                1 Неделя
              </button>
              <button
                onClick={() => loadCandles(currentDataInfo.figi, 30)}
                className="flex-1 py-2 text-xs rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
              >
                1 Мес
              </button>
            </div>

            <div className={`flex-1 rounded-2xl overflow-hidden border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
              <div className="overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                <table className="w-full text-xs text-left">
                  <thead className={`sticky top-0 ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                    <tr>
                      <th className="px-3 py-2">Время</th>
                      <th className="px-3 py-2 text-right">Close</th>
                      <th className="px-3 py-2 text-right">Vol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {candles.slice().reverse().map((c, idx) => (
                      <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="px-3 py-2 text-gray-600 dark:text-gray-400">
                          {formatTime(c.time)}
                        </td>
                        <td className="px-3 py-2 text-right font-mono text-gray-800 dark:text-gray-200">
                          {parseFloat(c.c).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-500 text-[10px]">
                          {parseInt(c.v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {candles.length === 0 && (
                  <div className="p-8 text-center text-gray-400">Нет данных</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}