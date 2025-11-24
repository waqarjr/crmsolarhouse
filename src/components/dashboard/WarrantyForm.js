'use client';
import React from 'react';
import { FileText } from 'lucide-react';

const WarrantyForm = ({ warrantyDetails, onChange }) => {
  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FileText className="text-purple-600" />
        Warranty Details
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Solar Panel Performance Warranty
          </label>
          <input
            type="text"
            value={warrantyDetails.solarPanelWarranty}
            onChange={(e) => onChange({...warrantyDetails, solarPanelWarranty: e.target.value})}
            placeholder="e.g., 25 years performance warranty"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ongrid Solar Inverter Company Warranty
          </label>
          <input
            type="text"
            value={warrantyDetails.ongridInverterWarranty}
            onChange={(e) => onChange({...warrantyDetails, ongridInverterWarranty: e.target.value})}
            placeholder="e.g., 5 years company warranty"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Ongrid Solar Inverter Local Company Warranty
          </label>
          <input
            type="text"
            value={warrantyDetails.ongridInverterLocalWarranty}
            onChange={(e) => onChange({...warrantyDetails, ongridInverterLocalWarranty: e.target.value})}
            placeholder="e.g., 10 years local company warranty"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );
};

export default WarrantyForm;
