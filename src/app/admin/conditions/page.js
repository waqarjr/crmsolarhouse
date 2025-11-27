'use client'
import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import HeadOfficeSection from '@/components/conditions/HeadOfficeSection';
import WarrantyDetailsSection from '@/components/conditions/WarrantyDetailsSection';
import TermsConditionsSection from '@/components/conditions/TermsConditionsSection';
import CustomerScopeSection from '@/components/conditions/CustomerScopeSection';
import NotesSection from '@/components/conditions/NotesSection';
import BehalfOfSection from '@/components/conditions/BehalfOfSection';
import PreviewSection from '@/components/conditions/PreviewSection';

export default function ConditionsPage() {
  // State arrays
  const [headOffice, setHeadOffice] = useState([]);
  const [warrantyDetails, setWarrantyDetails] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [customerScope, setCustomerScope] = useState([]);
  const [notes, setNotes] = useState([]);
  const [behalfOf, setBehalfOf] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Individual section save handler
  const handleSectionSave = async (data, sectionType) => {
    try {
      const response = await fetch('/api/conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionType,
          data
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`${sectionType} saved successfully!`);
      } else {
        alert(`Error saving ${sectionType}: ${result.error}`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save data');
    }
  };

  // Save all function
  const handleSave = () => {
    const data = {
      headOffice,
      warrantyDetails,
      termsConditions,
      customerScope,
      notes,
      behalfOf
    };
    console.log('Saved Data:', data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Conditions Page Editor</h1>
        
        {/* Two Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start">
          
          <HeadOfficeSection  />
          <WarrantyDetailsSection data={warrantyDetails} onUpdate={setWarrantyDetails} onSave={handleSectionSave} />
          <TermsConditionsSection data={termsConditions} onUpdate={setTermsConditions} onSave={handleSectionSave} />
          <CustomerScopeSection data={customerScope} onUpdate={setCustomerScope} onSave={handleSectionSave} />
          <NotesSection data={notes} onUpdate={setNotes} onSave={handleSectionSave} />
          <BehalfOfSection data={behalfOf} onUpdate={setBehalfOf} onSave={handleSectionSave} />
        </div>

        {/* Preview and Save Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button onClick={() => setShowPreview(!showPreview)} className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer flex items-center gap-2 font-semibold">
            <Eye size={20} /> {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={handleSave} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-semibold">Save All Data</button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <PreviewSection
            headOffice={headOffice}
            warrantyDetails={warrantyDetails}
            termsConditions={termsConditions}
            customerScope={customerScope}
            notes={notes}
            behalfOf={behalfOf}
          />
        )}
      </div>
    </div>
  );
}