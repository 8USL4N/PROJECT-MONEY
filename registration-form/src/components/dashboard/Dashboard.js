import React from 'react';
import PortfolioCard from './PortfolioCard';
import TradingPanel from './TradingPanel';
import MarketData from './MarketData';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-bold mb-2">Welcome to QuantumTrade</h1>
        <p className="text-blue-100 text-lg">
          AI-powered trading platform with real-time analytics and predictive models
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <PortfolioCard />
          <MarketData />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TradingPanel />
          
          {/* Quick Actions */}
          <div className="bg-white rounded-3xl shadow-lg border border-white/20 p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Train AI Model
              </button>
              <button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Run Backtest
              </button>
              <button className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
                Market Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-3xl shadow-lg border border-white/20 p-6 backdrop-blur-sm">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Trading Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200">
            <div className="text-green-600 text-sm font-semibold">SVR Model</div>
            <div className="text-2xl font-bold text-gray-800">84%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-4 border border-blue-200">
            <div className="text-blue-600 text-sm font-semibold">GPR Model</div>
            <div className="text-2xl font-bold text-gray-800">79%</div>
            <div className="text-xs text-gray-600">Accuracy</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-4 border border-purple-200">
            <div className="text-purple-600 text-sm font-semibold">Signal Strength</div>
            <div className="text-2xl font-bold text-gray-800">Strong</div>
            <div className="text-xs text-gray-600">Bullish Trend</div>
          </div>
        </div>
      </div>
    </div>
  );
}