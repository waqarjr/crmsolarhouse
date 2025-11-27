import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import SectionCard from './SectionCard';

export default function CustomerScopeSection({ data, onUpdate, onSave }) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onUpdate([...data, input]);
      setInput('');
    }
  };

  const handleRemove = (index) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  return (
    <SectionCard title="Customer Scope">
      <div className="space-y-2 mb-3">
        <input
          type="text"
          placeholder="Enter customer scope item"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add
          </button>
          {data.length > 0 && (
            <button
              onClick={() => onSave(data, 'customerScope')}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer flex items-center justify-center gap-2"
            >
              <Save size={18} /> Save
            </button>
          )}
        </div>
      </div>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className="text-sm text-gray-700">{index + 1} - {item}</span>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              <X size={18} />
            </button>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
