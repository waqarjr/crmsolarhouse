'use client';
import React, { useState, useEffect } from 'react';
import { Calculator, Zap } from 'lucide-react';

const TotalsSummary = ({ 
  totalWithoutNetMetering, 
  netMeteringCost = 0,
  onUpdateTotalWithoutNetMetering = () => {},
  onUpdateNetMeteringCost = () => {}
}) => {

  // Local state for base total only
  const [baseTotal, setBaseTotal] = useState(totalWithoutNetMetering || 0);

  // Update base total when props change
  useEffect(() => {
    setBaseTotal(totalWithoutNetMetering || 0);
  }, [totalWithoutNetMetering]);

  // Total calculation
  const calculatedTotal = baseTotal + (parseFloat(netMeteringCost) || 0);

  // Base total update handler
  const handleBaseTotalChange = (value) => {
    const newBase = parseFloat(value) || 0;
    setBaseTotal(newBase);
    onUpdateTotalWithoutNetMetering(newBase);
  };

  // Net-metering update handler
  const handleNetMeteringChange = (value) => {
    const newCost = parseFloat(value) || 0;
    onUpdateNetMeteringCost(newCost);
  };

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Base Total */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-700">Base Total</span>
            <Calculator className="text-orange-500" size={22} />
          </div>

          <label className="block">
            <span className="text-sm text-gray-500">Enter amount (PKR)</span>
            <input
              type="number"
              value={baseTotal}
              onChange={(e) => handleBaseTotalChange(e.target.value)}
              className="mt-1 w-full p-3 text-xl font-bold text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              placeholder="0"
            />
          </label>
        </div>

        {/* Net Metering */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-700 mt-1">Net-metering</span>
            <Zap className="text-blue-500" size={22} />
          </div>

          <label className="block">
            <span className="text-sm text-gray-500">Net-metering cost (PKR)</span>
            <input
              type="number"
              value={netMeteringCost}
              onChange={(e) => handleNetMeteringChange(e.target.value)}
              className="mt-1 w-full p-3 text-xl font-bold text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
              placeholder="0"
            />
          </label>

          <button
            onClick={() => handleNetMeteringChange(110000)}
            className="mt-4 w-full py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition"
          >
            Set Default (110,000)
          </button>
        </div>

        {/* Grand Total */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold text-gray-700">Grand Total</span>
            <Calculator className="text-green-600" size={22} />
          </div>

          <div className="p-3 text-3xl font-extrabold text-green-600">
            PKR {calculatedTotal.toLocaleString('en-PK')}
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            ({baseTotal.toLocaleString()} + {netMeteringCost.toLocaleString()})
          </p>
        </div>

      </div>
    </div>
  );
};

export default TotalsSummary;
