import React, { useState } from 'react';
import { marketAPI } from '../../services/api';

export default function MarketData() {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [figi, setFigi] = useState('BBG000B9XRY4'); // Apple example

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const response = await marketAPI.loadCandles(figi, 7);
      setMarketData(response.data);
    } catch (error) {
      console.error('Error loading market data:', error);
      alert('Error loading market data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-white/20 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Market Data</h2>
        <div className="flex space-x-3">
          <input
            type="text"
            value={figi}
            onChange={(e) => setFigi(e.target.value)}
            placeholder="Enter FIGI"
            className="border border-gray-300 rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <button
            onClick={loadMarketData}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load'}
          </button>
        </div>
      </div>

      {marketData && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border border-blue-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-blue-600 text-sm font-semibold">Candles Loaded</div>
              <div className="text-2xl font-bold text-gray-800">{marketData.candles_saved}</div>
            </div>
            <div>
              <div className="text-green-600 text-sm font-semibold">Status</div>
              <div className="text-2xl font-bold text-gray-800">{marketData.status}</div>
            </div>
            <div>
              <div className="text-purple-600 text-sm font-semibold">FIGI</div>
              <div className="text-lg font-bold text-gray-800 truncate">{figi}</div>
            </div>
            <div>
              <div className="text-orange-600 text-sm font-semibold">Period</div>
              <div className="text-2xl font-bold text-gray-800">7 days</div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Chart Placeholder */}
      <div className="mt-6 bg-gray-50 rounded-2xl p-8 text-center">
        <div className="text-gray-500 mb-4">Price Chart Visualization</div>
        <div className="h-48 bg-gradient-to-b from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
          <span className="text-gray-400">Chart will appear here</span>
        </div>
      </div>

      {/* Popular Instruments */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Popular Instruments</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { figi: 'BBG000B9XRY4', name: 'Apple', change: '+1.2%' },
            { figi: 'BBG000BVPV84', name: 'Google', change: '+0.8%' },
            { figi: 'BBG006L8G4H4', name: 'Tesla', change: '-0.5%' },
            { figi: 'BBG000C2P3G6', name: 'Amazon', change: '+1.5%' },
          ].map((stock, index) => (
            <button
              key={index}
              onClick={() => setFigi(stock.figi)}
              className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-3 text-center transition-all duration-200"
            >
              <div className="font-medium text-gray-800">{stock.name}</div>
              <div className={`text-sm ${stock.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}