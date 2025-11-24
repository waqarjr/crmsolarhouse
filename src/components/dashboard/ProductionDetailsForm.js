'use client';
import React from 'react';
import { Calculator } from 'lucide-react';

const ProductionDetailsForm = ({ productionDetails, onChange }) => {
  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 mb-8">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Calculator className="text-blue-600" />
        Monthly Production & Savings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Monthly Production (units)
          </label>
          <input
            type="number"
            value={productionDetails.monthlyProduction}
            onChange={(e) => onChange({...productionDetails, monthlyProduction: parseFloat(e.target.value) || 0})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Production (units)
          </label>
          <input
            type="number"
            value={productionDetails.annualProduction}
            onChange={(e) => onChange({...productionDetails, annualProduction: parseFloat(e.target.value) || 0})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual Saving (PKR)
          </label>
          <input
            type="number"
            value={productionDetails.annualSaving}
            onChange={(e) => onChange({...productionDetails, annualSaving: parseFloat(e.target.value) || 0})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Backup Period (years)
          </label>
          <input
            type="number"
            step="0.01"
            value={productionDetails.backupPeriod}
            onChange={(e) => onChange({...productionDetails, backupPeriod: parseFloat(e.target.value) || 0})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductionDetailsForm;
