import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/trading', label: 'Trading', icon: '💹' },
    { path: '/portfolio', label: 'Portfolio', icon: '💰' },
    { path: '/market', label: 'Market Data', icon: '📈' },
    { path: '/models', label: 'AI Models', icon: '🤖' },
    { path: '/backtest', label: 'Backtesting', icon: '🔍' },
    { path: '/analytics', label: 'Analytics', icon: '📋' },
  ];

  return (
    <div className="bg-white shadow-lg fixed left-0 top-16 h-full w-64 border-r">
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-2xl transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform -translate-y-0.5'
                    : 'text-gray-700 hover:bg-gray-100 hover:shadow-md'
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="absolute bottom-6 left-4 right-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-4 border border-white/20 backdrop-blur-sm">
          <p className="text-sm font-medium text-gray-700">Trading Status</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}