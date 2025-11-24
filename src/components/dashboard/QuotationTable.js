'use client';
import React from 'react';
import { Search, Trash2, Package } from 'lucide-react';

const QuotationTable = ({ quotationItems, onUpdateItem, onRemoveItem }) => {
  return (
    <div className="mb-8">
      {quotationItems.length === 0 ? (
        <div className="p-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200 text-center">
          <div className="flex flex-col items-center gap-3">
            <Search size={64} className="text-gray-300" />
            <p className="text-xl font-semibold text-gray-700">No items added yet</p>
            <p className="text-sm text-gray-500">Search and select products from WooCommerce to add them</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {quotationItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
            >
              {/* Header with Serial Number and Delete Button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package size={20} className="text-blue-600" />
                    <span className="font-semibold text-lg">Item #{index + 1}</span>
                  </div>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition border-2 border-red-200 hover:border-red-300"
                  title="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Description */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Description
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                    placeholder="Enter product description"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    type="text"
                    value={item.brand}
                    onChange={(e) => onUpdateItem(item.id, 'brand', e.target.value)}
                    placeholder="Brand name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Model / Specification
                  </label>
                  <input
                    type="text"
                    value={item.model}
                    onChange={(e) => onUpdateItem(item.id, 'model', e.target.value)}
                    placeholder="Model or spec"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => onUpdateItem(item.id, 'qty', e.target.value)}
                    min="1"
                    placeholder="Qty"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rate (PKR)
                  </label>
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => onUpdateItem(item.id, 'rate', e.target.value)}
                    min="0"
                    step="0.01"
                    placeholder="Rate"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>

                {/* Amount (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Amount
                  </label>
                  <div className="w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg font-bold text-green-700 text-lg flex items-center">
                    PKR {item.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationTable;
