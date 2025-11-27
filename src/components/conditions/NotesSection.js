import React, { useState } from 'react';
import { X, Plus, Save } from 'lucide-react';
import SectionCard from './SectionCard';

export default function NotesSection({ data, onUpdate, onSave }) {
  const [normalNote, setNormalNote] = useState('');
  const [importantNote, setImportantNote] = useState('');

  const handleAddNormal = () => {
    if (normalNote.trim()) {
      onUpdate([...data, { text: normalNote, important: false }]);
      setNormalNote('');
    }
  };

  const handleAddImportant = () => {
    if (importantNote.trim()) {
      onUpdate([...data, { text: importantNote, important: true }]);
      setImportantNote('');
    }
  };

  const handleRemove = (index) => {
    onUpdate(data.filter((_, i) => i !== index));
  };

  return (
    <SectionCard title="Notes">
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
            onClick={handleAddNormal}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer flex items-center justify-center gap-2"
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
            onClick={handleAddImportant}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Important Note
          </button>
        </div>
        {data.length > 0 && (
          <button
            onClick={() => onSave(data, 'notes')}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save Notes
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
            <span className={item.important ? "text-sm text-red-600 font-bold" : "text-sm text-gray-700"}>
              {item.text}
            </span>
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
