import React from 'react';

export default function PreviewSection({
  headOffice,
  warrantyDetails,
  termsConditions,
  customerScope,
  notes,
  behalfOf
}) {
  const hasData = headOffice.length > 0 || warrantyDetails.length > 0 || 
                  termsConditions.length > 0 || customerScope.length > 0 || 
                  notes.length > 0 || behalfOf.length > 0;

  return (
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

        {!hasData && (
          <p className="text-center text-gray-500 py-8">No data to preview. Please add some items first.</p>
        )}
      </div>
    </div>
  );
}
