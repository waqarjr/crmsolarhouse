'use client'
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import HeadingSection from '@/components/conditions/HeadingSection';
import HeadOfficeSection from '@/components/conditions/HeadOfficeSection';
import WarrantyDetailsSection from '@/components/conditions/WarrantyDetailsSection';
import TermsConditionsSection from '@/components/conditions/TermsConditionsSection';
import CustomerScopeSection from '@/components/conditions/CustomerScopeSection';
import NotesSection from '@/components/conditions/NotesSection';
import BehalfOfSection from '@/components/conditions/BehalfOfSection';
import PreviewSection from '@/components/conditions/PreviewSection';

export default function ConditionsPage() {
  // State arrays
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Conditions Page Editor</h1>
        
        {/* Heading Section - Full Width */}
        <div className="mb-6">
          <HeadingSection />
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
          <HeadOfficeSection />
          <WarrantyDetailsSection />
          <TermsConditionsSection />
          <CustomerScopeSection />
          <NotesSection />
          <BehalfOfSection />
        </div>

        {/* Preview Button */}
        <div className="flex gap-4 justify-center mb-6">
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer flex items-center gap-2 font-semibold"
          >
            <Eye size={20} /> {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <PreviewSection />
        )}
      </div>
    </div>
  );
}