'use client'
import React, { useState } from 'react';
import { X, Plus, Eye } from 'lucide-react';

export default function ConditionsPage() {
  const [headOffice, setHeadOffice] = useState([]);
  const [warrantyDetails, setWarrantyDetails] = useState([]);
  const [termsConditions, setTermsConditions] = useState([]);
  const [customerScope, setCustomerScope] = useState([]);
  const [notes, setNotes] = useState([]);
  const [behalfOf, setBehalfOf] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  // Input states
  const [headOfficeHeading, setHeadOfficeHeading] = useState('');
  const [headOfficeData, setHeadOfficeData] = useState('');
  const [warrantyInput, setWarrantyInput] = useState('');
  const [termsInput, setTermsInput] = useState('');
  const [scopeInput, setScopeInput] = useState('');
  const [normalNote, setNormalNote] = useState('');
  const [importantNote, setImportantNote] = useState('');
  const [behalfInput, setBehalfInput] = useState('');

  // Add functions
  const addHeadOffice = () => {
    if (headOfficeHeading.trim() && headOfficeData.trim()) {
      setHeadOffice([...headOffice, { heading: headOfficeHeading, data: headOfficeData }]);
      setHeadOfficeHeading('');
      setHeadOfficeData('');
    }
  };

  const addWarranty = () => {
    if (warrantyInput.trim()) {
      setWarrantyDetails([...warrantyDetails, warrantyInput]);
      setWarrantyInput('');
    }
  };

  const addTerms = () => {
    if (termsInput.trim()) {
      setTermsConditions([...termsConditions, termsInput]);
      setTermsInput('');
    }
  };

  const addScope = () => {
    if (scopeInput.trim()) {
      setCustomerScope([...customerScope, scopeInput]);
      setScopeInput('');
    }
  };

  const addNormalNote = () => {
    if (normalNote.trim()) {
      setNotes([...notes, { text: normalNote, important: false }]);
      setNormalNote('');
    }
  };

  const addImportantNote = () => {
    if (importantNote.trim()) {
      setNotes([...notes, { text: importantNote, important: true }]);
      setImportantNote('');
    }
  };

  const addBehalf = () => {
    if (behalfInput.trim()) {
      setBehalfOf([...behalfOf, behalfInput]);
      setBehalfInput('');
    }
  };

  // Remove functions
  const removeHeadOffice = (index) => {
    setHeadOffice(headOffice.filter((_, i) => i !== index));
  };

  const removeWarranty = (index) => {
    setWarrantyDetails(warrantyDetails.filter((_, i) => i !== index));
  };

  const removeTerms = (index) => {
    setTermsConditions(termsConditions.filter((_, i) => i !== index));
  };

  const removeScope = (index) => {
    setCustomerScope(customerScope.filter((_, i) => i !== index));
  };

  const removeNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const removeBehalf = (index) => {
    setBehalfOf(behalfOf.filter((_, i) => i !== index));
  };

  // Save function
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
    alert('Data saved! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Conditions Page Editor</h1>
        
        {/* Two Column Grid */}
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start ">
          
          {/* Head Office Section */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Head Office</h3>
            <div className="space-y-2 mb-3">
              <input type="text" placeholder="Heading" value={headOfficeHeading} onChange={(e) => setHeadOfficeHeading(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <input
                type="text"
                placeholder="Data"
                value={headOfficeData}
                onChange={(e) => setHeadOfficeData(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addHeadOffice}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <ul className="space-y-2">
              {headOffice.map((item, index) => (
                <li key={index} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                  <div>
                    <p className="font-semibold text-sm text-gray-800">{item.heading}</p>
                    <p className="text-sm text-gray-600">{item.data}</p>
                  </div>
                  <button onClick={() => removeHeadOffice(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Warranty Details */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Warranty Details</h3>
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Enter warranty detail"
                value={warrantyInput}
                onChange={(e) => setWarrantyInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addWarranty}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <ul className="space-y-2">
              {warrantyDetails.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{item}</span>
                  <button onClick={() => removeWarranty(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Terms & Conditions</h3>
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Enter term or condition"
                value={termsInput}
                onChange={(e) => setTermsInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addTerms}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <ul className="space-y-2">
              {termsConditions.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{index + 1} - {item}</span>
                  <button onClick={() => removeTerms(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Scope */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Customer Scope</h3>
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Enter customer scope item"
                value={scopeInput}
                onChange={(e) => setScopeInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addScope}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <ul className="space-y-2">
              {customerScope.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{index + 1} - {item}</span>
                  <button onClick={() => removeScope(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Notes</h3>
            <div className="space-y-3 mb-3">
              <div>
                <input
                  type="text"
                  placeholder="Enter normal note"
                  value={normalNote}
                  onChange={(e) => setNormalNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                />
                <button
                  onClick={addNormalNote}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer flex items-center gap-2"
                >
                  <Plus size={18} /> Add Normal Note
                </button>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Enter important note"
                  value={importantNote}
                  onChange={(e) => setImportantNote(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400 mb-2"
                />
                <button
                  onClick={addImportantNote}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer flex items-center gap-2"
                >
                  <Plus size={18} /> Add Important Note
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {notes.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className={item.important ? "text-sm text-red-600 font-bold" : "text-sm text-gray-700"}>
                    {item.text}
                  </span>
                  <button onClick={() => removeNote(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* For and On Behalf of SNM Solutions */}
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">For and On Behalf of SNM Solutions</h3>
            <div className="space-y-2 mb-3">
              <input
                type="text"
                placeholder="Enter representative information"
                value={behalfInput}
                onChange={(e) => setBehalfInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={addBehalf}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center gap-2"
              >
                <Plus size={18} /> Add
              </button>
            </div>
            <ul className="space-y-2">
              {behalfOf.map((item, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{item}</span>
                  <button onClick={() => removeBehalf(index)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preview and Save Buttons */}
        <div className="flex gap-4 justify-center mb-6">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 cursor-pointer flex items-center gap-2 font-semibold"
          >
            <Eye size={20} /> {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer font-semibold"
          >
            Save All Data
          </button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Preview - All Data</h2>
            
            <div className="space-y-6">
              {/* Head Office Preview */}
              {headOffice.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Head Office</h3>
                  <div className="space-y-2">
                    {headOffice.map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-semibold text-gray-800">{item.heading}</p>
                        <p className="text-gray-600">{item.data}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warranty Details Preview */}
              {warrantyDetails.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Warranty Details</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {warrantyDetails.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Terms & Conditions Preview */}
              {termsConditions.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Terms & Conditions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {termsConditions.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Customer Scope Preview */}
              {customerScope.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Customer Scope</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {customerScope.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Notes Preview */}
              {notes.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Notes</h3>
                  <div className="space-y-2">
                    {notes.map((item, index) => (
                      <p key={index} className={item.important ? "text-red-600 font-bold" : "text-gray-700"}>
                        • {item.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* For and On Behalf Preview */}
              {behalfOf.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">For and On Behalf of SNM Solutions</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {behalfOf.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {headOffice.length === 0 && warrantyDetails.length === 0 && termsConditions.length === 0 && 
               customerScope.length === 0 && notes.length === 0 && behalfOf.length === 0 && (
                <p className="text-center text-gray-500 py-8">No data to preview. Please add some items first.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}