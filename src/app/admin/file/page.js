"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Trash2, Loader2 } from "lucide-react";

export default function FilePage() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await fetch("/api/quotation");
      if (!response.ok) throw new Error("Failed to fetch quotations");
      const data = await response.json();
      setQuotations(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this quotation?")) return;

    try {
      const response = await fetch(`/api/quotation/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete quotation");
      
      // Remove from state
      setQuotations(quotations.filter((q) => q.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Quotations</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {quotations.map((q) => {
              // Parse billing to get name
              let name = "N/A";
              try {
                // billing might be an object or a string depending on how it's returned by mysql driver (usually object if JSON column)
                // But in the API POST it was stringified. MySQL JSON type returns object in JS usually.
                // Let's handle both.
                const billing = typeof q.billing === 'string' ? JSON.parse(q.billing) : q.billing;
                if (billing) {
                   name = `${billing.firstName || ''} ${billing.lastName || ''}`.trim();
                }
              } catch (e) {
                console.error("Error parsing billing JSON", e);
              }

              // Format date and time
              const date = new Date(q.date_created).toLocaleDateString();
              // time_created might be a string "HH:MM:SS"
              const time = q.time_created;

              return (
                <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{q.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{q.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {date} <span className="text-gray-400">|</span> {time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${q.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        q.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <Link href={`/admin/file/${q.id}`} className="text-blue-600 hover:text-blue-900 inline-flex items-center">
                      <Eye className="w-4 h-4 mr-1" /> View
                    </Link>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {quotations.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">No quotations found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}