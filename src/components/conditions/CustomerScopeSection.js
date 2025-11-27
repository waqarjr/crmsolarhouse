import React, { useEffect, useState } from 'react';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import axios from 'axios';

const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    {children}
  </div>
);

export default function CustomerScopeSection() {
  const [inputValue, setInputValue] = useState('');
  const [newItems, setNewItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    if (inputValue.trim()) {
      setNewItems([...newItems, inputValue]);
      setInputValue('');
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/conditions', {
        params: { sectionType: 'customerScope' }
      });

      const data = response.data.data;

      if (data && data.length > 0) {
        const scopeData = data[0].customerScope;
        
        if (typeof scopeData === 'string') {
          setSavedItems(JSON.parse(scopeData));
        } else if (Array.isArray(scopeData)) {
          setSavedItems(scopeData);
        } else {
          setSavedItems([]);
        }
      } else {
        setSavedItems([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setSavedItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleRemoveNew = (index) => {
    setNewItems(newItems.filter((_, i) => i !== index));
  };

  const handleRemoveSaved = async (index) => {
    try {
      const updatedItems = savedItems.filter((_, i) => i !== index);
      
      const response = await axios.put('/api/conditions', {
        data: updatedItems,
        sectionType: 'customerScope'
      });

      if (response.data.success) {
        setSavedItems(updatedItems);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item. Please try again.');
    }
  };

  const handleSave = async () => {
    if (newItems.length === 0) return;
    
    setSaving(true);
    try {
      const response = await axios.post('/api/conditions', {
        data: newItems,
        sectionType: 'customerScope'
      });
      
      if (response.data.success) {
        setNewItems([]);
        getData();
      }
    } catch (error) {
      console.error('Error saving customer scope:', error);
      alert('Failed to save items. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Customer Scope">
      <div className="space-y-2 mb-3">
        <input
          type="text"
          placeholder="Enter scope item..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add
          </button>
          {newItems.length > 0 && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save size={18} /> Save
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {newItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">New Items (Not Saved)</h3>
          <ul className="space-y-2">
            {newItems.map((item, index) => (
              <li key={`new-${index}`} className="flex items-start justify-between bg-yellow-50 p-2 rounded border border-yellow-200">
                <p className="text-sm text-gray-700">{item}</p>
                <button
                  onClick={() => handleRemoveNew(index)}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Saved Items</h3>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : (
          <ul className="space-y-2">
            {savedItems.length === 0 ? (
              <li className="text-sm text-gray-500 text-center py-4">No saved items yet</li>
            ) : (
              savedItems.map((item, index) => (
                <li key={index} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                  <p className="text-sm text-gray-700">{item}</p>
                  <button 
                    onClick={() => handleRemoveSaved(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </SectionCard>
  );
}
