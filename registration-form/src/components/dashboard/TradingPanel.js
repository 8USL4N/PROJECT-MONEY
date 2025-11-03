import React, { useState } from 'react';
import { tradeAPI } from '../../services/api';

export default function TradingPanel() {
  const [orderData, setOrderData] = useState({
    figi: '',
    side: 'buy',
    qty: 0
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await tradeAPI.executeOrder(orderData);
      alert('Order executed successfully!');
      setOrderData({ figi: '', side: 'buy', qty: 0 });
    } catch (error) {
      alert('Error executing order: ' + (error.response?.data?.detail || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-white/20 p-6 backdrop-blur-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Trade</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">FIGI</label>
          <input
            type="text"
            name="figi"
            value={orderData.figi}
            onChange={handleChange}
            placeholder="BBG000B9XRY4"
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Side</label>
          <select
            name="side"
            value={orderData.side}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
          <input
            type="number"
            name="qty"
            value={orderData.qty}
            onChange={handleChange}
            min="1"
            required
            className="w-full border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-2xl font-semibold text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 ${
            orderData.side === 'buy' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'
              : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {loading ? 'Executing...' : `${orderData.side === 'buy' ? 'Buy' : 'Sell'} Stock`}
        </button>
      </form>

      {/* Market Info */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Market Status</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center bg-gray-50 rounded-2xl p-3">
            <div className="text-gray-600">S&P 500</div>
            <div className="font-semibold text-green-600">+0.8%</div>
          </div>
          <div className="text-center bg-gray-50 rounded-2xl p-3">
            <div className="text-gray-600">NASDAQ</div>
            <div className="font-semibold text-green-600">+1.2%</div>
          </div>
        </div>
      </div>
    </div>
  );
}