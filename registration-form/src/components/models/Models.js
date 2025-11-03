// src/components/models/Models.js
import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export default function Models() {
  const [activeTab, setActiveTab] = useState('svr');
  const { isDark } = useTheme();

  const modelConfigs = {
    svr: {
      name: 'Support Vector Regression',
      kernel: 'RBF',
      parameters: ['C', 'gamma', 'epsilon']
    },
    gpr: {
      name: 'Gaussian Process Regression', 
      kernel: 'Matérn',
      parameters: ['length_scale', 'nu']
    },
    adaptive: {
      name: 'Adaptive Model',
      kernel: 'Dynamic',
      parameters: ['volatility_threshold', 'switch_sensitivity']
    }
  };

  return (
    <div className="space-y-6">
      <div className={`rounded-3xl p-8 text-white shadow-2xl ${
        isDark
          ? 'bg-gradient-to-r from-green-600 to-cyan-600'
          : 'bg-gradient-to-r from-blue-500 to-purple-600'
      }`}>
        <h1 className="text-3xl font-bold mb-2">AI Models</h1>
        <p className={isDark ? 'text-cyan-100' : 'text-blue-100'}>
          Configure and manage your machine learning models
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Model Tabs */}
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

        {/* Model Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Model Configuration
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kernel Type
                </label>
                <div className={`px-4 py-3 rounded-2xl ${
                  isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'
                }`}>
                  {modelConfigs[activeTab].kernel}
                </div>
              </div>

              {modelConfigs[activeTab].parameters.map((param) => (
                <div key={param}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {param}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    defaultValue="1.0"
                    className={`w-full rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:ring-cyan-500'
                        : 'border border-gray-300 focus:ring-blue-500'
                    }`}
                  />
                </div>
              ))}
            </div>

            <button className={`w-full mt-6 py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 ${
              isDark
                ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-700 hover:to-cyan-700'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}>
              Train Model
            </button>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Model Performance
            </h3>
            <div className={`rounded-2xl p-6 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {activeTab === 'svr' ? '84%' : activeTab === 'gpr' ? '79%' : '87%'}
                </div>
                <div className="text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">MAE</span>
                  <span className="font-semibold">0.023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">RMSE</span>
                  <span className="font-semibold">0.045</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">R² Score</span>
                  <span className="font-semibold">0.92</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}