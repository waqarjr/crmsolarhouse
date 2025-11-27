import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import axios from 'axios';

// SectionCard component for heading
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    {children}
  </div>
);

export default function HeadingSection() {
  const [heading, setHeading] = useState('');
  const [originalHeading, setOriginalHeading] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if data has changed
  const hasChanged = heading !== originalHeading;

  const getData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/conditions', {
        params: { sectionType: 'heading' }
      });

      const data = response.data.data;

      if (data && data.length > 0) {
        const headingValue = data[0].heading || '';
        setHeading(headingValue);
        setOriginalHeading(headingValue);
      } else {
        setHeading('');
        setOriginalHeading('');
      }
    } catch (err) {
      console.error('Error fetching heading:', err);
      setHeading('');
      setOriginalHeading('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSave = async () => {
    if (!hasChanged || !heading.trim()) return;
    
    setSaving(true);
    try {
      const response = await axios.put('/api/conditions', {
        data: heading,
        sectionType: 'heading'
      });
      if (response.data.success) {
        setOriginalHeading(heading);
      }
    } catch (error) {
      console.error('Error saving heading:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SectionCard title="Page Heading">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Main Heading
          </label>
          <input
            type="text"
            placeholder="Enter page heading..."
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 size={20} className="animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={!hasChanged || saving || !heading.trim()}
            className={`w-full px-4 py-2 rounded flex items-center justify-center gap-2 font-medium transition-colors ${
              hasChanged && heading.trim()
                ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={18} /> {hasChanged ? 'Save Changes' : 'No Changes'}
              </>
            )}
          </button>
        )}

        {hasChanged && (
          <p className="text-xs text-amber-600 text-center">
            ⚠️ You have unsaved changes
          </p>
        )}
      </div>
    </SectionCard>
  );
}
