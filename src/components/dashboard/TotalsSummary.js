'use client';
import React from 'react';
import { Calculator } from 'lucide-react';

const TotalsSummary = ({ totalWithoutNetMetering, totalWithNetMetering }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Total Cost without Net-metering</span>
          <Calculator className="text-orange-600" size={24} />
        </div>
        <div className="text-3xl font-bold text-orange-600">
          PKR {totalWithoutNetMetering.toLocaleString()}
        </div>
        <p className="text-xs text-gray-600 mt-2">Excludes net-metering related items</p>
      </div>
      
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Total Cost with Net-metering</span>
          <Calculator className="text-green-600" size={24} />
        </div>
        <div className="text-3xl font-bold text-green-600">
          PKR {totalWithNetMetering.toLocaleString()}
        </div>
        <p className="text-xs text-gray-600 mt-2">Includes all items</p>
      </div>
    </div>
  );
};

export default TotalsSummary;
