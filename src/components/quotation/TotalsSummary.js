'use client';
import React, { useState, useEffect } from 'react';
import { Calculator, Zap } from 'lucide-react';


const TotalsSummary = ({ 
  quotationItems = [],
  onTotalsChange = () => {}
}) => {

  // Local state
  const [manualBaseTotal, setManualBaseTotal] = useState(null);
  const [netMeteringCost, setNetMeteringCost] = useState(0);

  // Calculate automatic total from items
  const automaticBaseTotal = quotationItems
    .filter(item => !item.description.toLowerCase().includes('net-metering') && 
                   !item.description.toLowerCase().includes('net metering'))
    .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Determine effective total (manual override takes precedence)
  const effectiveBaseTotal = manualBaseTotal !== null ? manualBaseTotal : automaticBaseTotal;
  
  // Calculate grand total
  const grandTotal = effectiveBaseTotal + (parseFloat(netMeteringCost) || 0);

  // Notify parent of changes
  useEffect(() => {
    onTotalsChange({
      withoutNetMetering: effectiveBaseTotal,
      withNetMetering: grandTotal
    });
  }, [effectiveBaseTotal, grandTotal]);

  // Handlers
  const handleBaseTotalChange = (value) => {
    if (value === '') {
      setManualBaseTotal(null); // Revert to automatic if cleared
    } else {
      setManualBaseTotal(parseFloat(value) || 0);
    }
  };

  const handleNetMeteringChange = (value) => {
    setNetMeteringCost(parseFloat(value) || 0);
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
              value={effectiveBaseTotal}
              onChange={(e) => handleBaseTotalChange(e.target.value)}
              className="mt-1 w-full p-3 text-xl font-bold text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none"
              placeholder="Auto-calculated"
            />
          </label>
          {manualBaseTotal !== null && (
            <button 
              onClick={() => setManualBaseTotal(null)}
              className="text-xs text-orange-600 mt-2 hover:underline"
            >
              Reset to Auto-calculation
            </button>
          )}
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
            PKR {grandTotal.toLocaleString('en-PK')}
          </div>

          <p className="text-xs text-gray-500 text-center mt-6">
            ({effectiveBaseTotal.toLocaleString()} + {netMeteringCost.toLocaleString()})
          </p>
        </div>

      </div>
    </div>
  );
};

export default TotalsSummary;
