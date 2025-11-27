import React from 'react';

export default function SectionCard({ title, children }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}
