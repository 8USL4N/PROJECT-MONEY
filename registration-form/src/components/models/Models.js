import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { modelAPI, marketAPI } from '../../services/api';

export default function Models() {
  const [activeTab, setActiveTab] = useState('svr');
  const [candles, setCandles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [modelParams, setModelParams] = useState({
    svr: { C: 1.0, epsilon: 0.1, gamma: 'scale' },
    gpr: { nu: 1.5, length_scale: 1.0 }
  });
  const { isDark } = useTheme();

  const modelConfigs = {
    svr: {
      name: 'Метод опорных векторов',
      kernel: 'RBF',
      parameters: [
        { name: 'C', type: 'number', min: 0.1, max: 10, step: 0.1 },
        { name: 'gamma', type: 'select', options: ['scale', 'auto'] },
        { name: 'epsilon', type: 'number', min: 0.01, max: 1, step: 0.01 }
      ]
    },
    gpr: {
      name: 'Гауссовская регрессия', 
      kernel: 'Matérn',
      parameters: [
        { name: 'length_scale', type: 'number', min: 0.1, max: 10, step: 0.1 },
        { name: 'nu', type: 'number', min: 0.5, max: 2.5, step: 0.5 }
      ]
    }
  };

  // Получение исторических свечей и подготовка данных для обучения
  const loadCandles = async (figi = 'BBG00475JZZ6', days = 1) => {
    try {
      setStatusMessage('Загрузка исторических данных...');
      const response = await marketAPI.loadCandles(figi, days);
      const loadedCandles = response.data.candles || [];
      setCandles(loadedCandles);
      setStatusMessage(`Загружено свечей: ${loadedCandles.length}`);
      
      return loadedCandles;
    } catch (error) {
      console.error('Ошибка загрузки свечей:', error);
      setStatusMessage('❌ Не удалось загрузить свечи');
      return [];
    }
  };

  // Подготовка данных для обучения модели
  const prepareTrainingData = (candlesData) => {
    if (!candlesData || candlesData.length < 10) {
      throw new Error('Недостаточно данных для обучения (нужно минимум 10 свечей)');
    }

    // Создаем фичи: цены открытия, закрытия, высокие, низкие, объемы
    const X = [];
    const y = [];
    
    // Используем последние 10 свечей для предсказания следующей цены закрытия
    const lookback = 10;
    
    for (let i = lookback; i < candlesData.length - 1; i++) {
      const features = [];
      
      // Добавляем данные из предыдущих свечей
      for (let j = i - lookback; j < i; j++) {
        const candle = candlesData[j];
        features.push(
          parseFloat(candle.o), // open
          parseFloat(candle.h), // high
          parseFloat(candle.l), // low
          parseFloat(candle.c), // close
          parseFloat(candle.v)  // volume
        );
      }
      
      X.push(features);
      // Предсказываем следующую цену закрытия
      y.push(parseFloat(candlesData[i + 1].c));
    }
    
    return { X, y };
  };

  useEffect(() => {
    loadCandles();
  }, []);

  // Обучение модели
  const trainModel = async () => {
    try {
      if (candles.length === 0) {
        setStatusMessage('❌ Нет данных для обучения. Сначала загрузите свечи.');
        return;
      }

      setLoading(true);
      setStatusMessage('Подготовка данных и обучение модели...');

      // Подготавливаем данные
      const { X, y } = prepareTrainingData(candles);
      
      console.log(`Подготовлено данных: X=${X.length} samples, y=${y.length} targets`);
      
      if (X.length === 0 || y.length === 0) {
        setStatusMessage('❌ Не удалось подготовить данные для обучения');
        setLoading(false);
        return;
      }

      let response;
      const currentParams = modelParams[activeTab];
      
      if (activeTab === 'svr') {
        response = await modelAPI.trainSVR({
          ...currentParams,
          X: X,
          y: y
        });
      } else if (activeTab === 'gpr') {
        response = await modelAPI.trainGPR({
          ...currentParams,
          X: X,
          y: y
        });
      } else {
        setStatusMessage('❌ Невозможно обучить выбранную модель');
        setLoading(false);
        return;
      }

      setStatusMessage(
        `✅ Модель обучена! ` +
        `MAE: ${response.data.metrics?.MAE?.toFixed(4) || 'N/A'}, ` +
        `R²: ${response.data.metrics?.R2?.toFixed(4) || 'N/A'}`
      );
    } catch (error) {
      console.error('Ошибка обучения модели:', error);
      setStatusMessage(`❌ Ошибка обучения: ${error.response?.data?.detail || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Обновление параметров модели
  const updateParam = (modelType, paramName, value) => {
    setModelParams(prev => ({
      ...prev,
      [modelType]: {
        ...prev[modelType],
        [paramName]: paramName === 'gamma' ? value : parseFloat(value)
      }
    }));
  };

  // Рендер поля ввода параметра
  const renderParameterInput = (param, modelType) => {
    const currentValue = modelParams[modelType][param.name];
    
    if (param.type === 'select') {
      return (
        <select
          value={currentValue}
          onChange={(e) => updateParam(modelType, param.name, e.target.value)}
          className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
              : 'border border-gray-300 focus:ring-blue-500'
          }`}
        >
          {param.options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          type="number"
          value={currentValue}
          min={param.min}
          max={param.max}
          step={param.step}
          onChange={(e) => updateParam(modelType, param.name, e.target.value)}
          className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
              : 'border border-gray-300 focus:ring-blue-500'
          }`}
        />
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">AI Модели</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Настройка и управление вашими машинными моделями
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Вкладки моделей */}
        <div className="flex space-x-4 mb-6">
          {Object.keys(modelConfigs).map((modelKey) => (
            <button
              key={modelKey}
              onClick={() => setActiveTab(modelKey)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeTab === modelKey
                  ? isDark
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {modelConfigs[modelKey].name}
            </button>
          ))}
        </div>

        {/* Конфигурация модели */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Конфигурация модели
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Тип ядра
                </label>
                <div className={`px-4 py-3 rounded-2xl ${
                  isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {modelConfigs[activeTab].kernel}
                </div>
              </div>

              {modelConfigs[activeTab].parameters.map((param) => (
                <div key={param.name}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {param.name}
                  </label>
                  {renderParameterInput(param, activeTab)}
                </div>
              ))}
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => loadCandles()}
                className={`flex-1 py-3 rounded-2xl font-semibold border transition-all duration-300 ${
                  isDark
                    ? 'border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white'
                    : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
                }`}
              >
                Обновить данные
              </button>

              <button
                onClick={trainModel}
                disabled={loading}
                className={`flex-1 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : isDark
                      ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {loading ? 'Обучение...' : 'Обучить модель'}
              </button>
            </div>

            {statusMessage && (
              <div className={`mt-4 p-3 rounded-xl ${
                statusMessage.includes('❌')
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                  : statusMessage.includes('✅')
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {statusMessage}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Исторические данные (candles)
            </h3>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Загружено свечей: {candles.length}
              </span>
              <button
                onClick={() => loadCandles()}
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                Обновить
              </button>
            </div>
            <div className={`rounded-2xl p-6 overflow-auto max-h-96 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {candles.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-800 dark:text-gray-200">
                  <thead>
                    <tr className="border-b border-gray-300 dark:border-gray-600">
                      <th className="pb-2">Time</th>
                      <th className="pb-2">Open</th>
                      <th className="pb-2">High</th>
                      <th className="pb-2">Low</th>
                      <th className="pb-2">Close</th>
                      <th className="pb-2">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candles.slice(0, 20).map((c, idx) => (
                      <tr key={idx} className="border-b border-gray-300 dark:border-gray-600">
                        <td className="py-2">{new Date(c.time).toLocaleString()}</td>
                        <td className="py-2">{parseFloat(c.o).toFixed(4)}</td>
                        <td className="py-2">{parseFloat(c.h).toFixed(4)}</td>
                        <td className="py-2">{parseFloat(c.l).toFixed(4)}</td>
                        <td className="py-2">{parseFloat(c.c).toFixed(4)}</td>
                        <td className="py-2">{parseInt(c.v).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Нет данных. Нажмите "Обновить данные" для загрузки.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}