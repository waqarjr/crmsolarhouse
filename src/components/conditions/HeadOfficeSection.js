import React, { useEffect, useState } from 'react';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import SectionCard from './SectionCard';
import axios from 'axios';

export default function HeadOfficeSection() {
  const [heading, setHeading] = useState('');
  const [dataValue, setDataValue] = useState('');
  const [newItems, setNewItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = () => {
    if (heading.trim() && dataValue.trim()) {
      setNewItems([...newItems, { heading, data: dataValue }]);
      setHeading('');
      setDataValue('');
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/conditions', {
        params: { sectionType: 'headOffice' }
      });
      
      if (response.data.success && response.data.data) {
        const parsedData = response.data.data.map(item => ({
          ...item,
          headoffice: JSON.parse(item.headoffice)
        }));
        setSavedItems(parsedData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
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

  const handleRemoveSaved = async (id) => {
    try {
      await axios.delete('/api/conditions', {
        data: { id, sectionType: 'headOffice' }
      });
      setSavedItems(savedItems.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSave = async () => {
    if (newItems.length === 0) return;
    
    setSaving(true);
    try {
      const response = await axios.post('/api/conditions', {
        data: newItems,
        sectionType: 'headOffice'
      });
      
      if (response.data.success) {
        setNewItems([]);
        getData(); // Refresh the saved items
      }
    } catch (error) {
      console.error('Error saving head office data:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Head Office">
      <div className="space-y-2 mb-3">
        <input
          type="text"
          placeholder="Heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Data"
          value={dataValue}
          onChange={(e) => setDataValue(e.target.value)}
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

      {/* New Items (Not saved yet) */}
      {newItems.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">New Items (Not Saved)</h3>
          <ul className="space-y-2">
            {newItems.map((item, index) => (
              <li key={`new-${index}`} className="flex items-start justify-between bg-yellow-50 p-2 rounded border border-yellow-200">
                <div>
                  <p className="font-semibold text-sm text-gray-800">{item.heading}</p>
                  <p className="text-sm text-gray-600">{item.data}</p>
                </div>
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

      {/* Saved Items from Database */}
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
              savedItems.map((item) => (
                <li key={item.id} className="flex items-start justify-between bg-gray-50 p-2 rounded">
                  <div>
                    {item.headoffice && Array.isArray(item.headoffice) ? (
                      item.headoffice.map((subItem, idx) => (
                        <div key={idx} className="mb-2 last:mb-0">
                          <p className="font-semibold text-sm text-gray-800">{subItem.heading}</p>
                          <p className="text-sm text-gray-600">{subItem.data}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No data available</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSaved(item.id)}
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