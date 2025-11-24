'use client';
import React from 'react';
import { FileText, Save } from 'lucide-react';

const QuotationHeader = () => {
  return (
    <div className="bg-blue-600 p-6 md:p-8 text-white">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Solar Quotation System</h1>
          <p className="text-blue-100">Create professional solar installation quotes with WooCommerce integration</p>
        </div>
      </div>
    </div>
  );
};

export default QuotationHeader;
