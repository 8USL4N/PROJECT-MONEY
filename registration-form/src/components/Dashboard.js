import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { tradeAPI, marketAPI, modelAPI, backtestAPI } from '../services/api';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadPortfolio = async () => {
    try {
      setLoading(true);
      const response = await tradeAPI.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Trading Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {currentUser?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Portfolio Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Portfolio</h3>
                <div className="mt-4">
                  {loading ? (
                    <p>Loading...</p>
                  ) : portfolio ? (
                    <div>
                      <p className="text-2xl font-semibold text-gray-900">
                        ${portfolio.total_value?.toFixed(2) || '0.00'}
                      </p>
                      <p className="text-sm text-gray-500">Total Value</p>
                    </div>
                  ) : (
                    <p>No portfolio data</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Quick Actions</h3>
                <div className="mt-4 space-y-3">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors">
                    Load Market Data
                  </button>
                  <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors">
                    Train Model
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition-colors">
                    Run Backtest
                  </button>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Account Info</h3>
                <div className="mt-4 space-y-2">
                  <p><strong>Username:</strong> {currentUser?.username}</p>
                  <p><strong>Email:</strong> {currentUser?.email}</p>
                  <p><strong>Tinkoff Token:</strong> {currentUser?.tinkoff_token ? 'Configured' : 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}