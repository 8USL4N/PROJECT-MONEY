import React, { useState, useEffect } from 'react';
import { tradeAPI } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';

export default function PortfolioCard() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const response = await tradeAPI.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border border-white/20 p-6 backdrop-blur-sm">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-white/20 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Portfolio Overview</h2>
        <button 
          onClick={loadPortfolio}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl text-sm font-semibold hover:shadow-lg transition-all duration-200"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-blue-200">
          <div className="text-blue-600 text-sm font-semibold">Total Value</div>
          <div className="text-3xl font-bold text-gray-800">
            ${portfolio?.total_value?.toFixed(2) || '0.00'}
          </div>
          <div className="text-green-600 text-sm mt-2">+2.3% Today</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-4 border border-green-200">
          <div className="text-green-600 text-sm font-semibold">Cash Balance</div>
          <div className="text-3xl font-bold text-gray-800">
            ${portfolio?.cash_balance?.toFixed(2) || '0.00'}
          </div>
          <div className="text-gray-600 text-sm mt-2">Available</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-4 border border-purple-200">
          <div className="text-purple-600 text-sm font-semibold">Positions</div>
          <div className="text-3xl font-bold text-gray-800">
            {portfolio?.positions_count || 0}
          </div>
          <div className="text-gray-600 text-sm mt-2">Active</div>
        </div>
      </div>

      {/* Recent Positions */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Positions</h3>
        <div className="space-y-3">
          {portfolio?.positions?.slice(0, 3).map((position, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl">
              <div>
                <div className="font-medium text-gray-800">{position.figi}</div>
                <div className="text-sm text-gray-600">{position.quantity} shares</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-800">${position.value?.toFixed(2)}</div>
                <div className={`text-sm ${position.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {position.change >= 0 ? '+' : ''}{position.change}%
                </div>
              </div>
            </div>
          )) || (
            <div className="text-center text-gray-500 py-4">
              No active positions
            </div>
          )}
        </div>
      </div>
    </div>
  );
}