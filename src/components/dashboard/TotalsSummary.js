'use client';
import React from 'react';
import { Calculator } from 'lucide-react';

const TotalsSummary = ({ 
  totalWithoutNetMetering, 
  totalWithNetMetering,
  onUpdateTotalWithoutNetMetering,
  onUpdateTotalWithNetMetering 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-orange-50 p-6 rounded-xl border-2 border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Total Cost without Net-metering</span>
          <Calculator className="text-orange-600" size={24} />
        </div>
        <input
          type="number"
          value={totalWithoutNetMetering}
          onChange={(e) => onUpdateTotalWithoutNetMetering(parseFloat(e.target.value) || 0)}
          className="w-full text-3xl font-bold text-orange-600 bg-transparent border-none outline-none"
          placeholder="0"
        />
        <p className="text-xs text-gray-600 mt-2">Excludes net-metering related items</p>
      </div>
      
      <div className="bg-green-50 p-6 rounded-xl border-2 border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold text-gray-700">Total Cost with Net-metering</span>
          <Calculator className="text-green-600" size={24} />
        </div>
        <input
          type="number"
          value={totalWithNetMetering}
          onChange={(e) => onUpdateTotalWithNetMetering(parseFloat(e.target.value) || 0)}
          className="w-full text-3xl font-bold text-green-600 bg-transparent border-none outline-none"
          placeholder="0"
        />
        <p className="text-xs text-gray-600 mt-2">Includes all items</p>
      </div>
    </div>
  );
};

export default TotalsSummary;
