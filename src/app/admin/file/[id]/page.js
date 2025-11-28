"use client";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, FileText } from "lucide-react";
import { generateQuotationPDF } from "@/utils/generateQuotationPDF";

export default function QuotationDetailsPage({ params }) {
  const { id } = use(params);
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [conditions, setConditions] = useState(null);

  useEffect(() => {
    fetchQuotationDetails();
    fetchConditions();
  }, [id]);

  const fetchConditions = async () => {
    try {
      const response = await fetch("/api/conditions");
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data && result.data.length > 0) {
          setConditions(result.data[0]);
        }
      }
    } catch (err) {
      console.error("Error fetching conditions:", err);
    }
  };

  const fetchQuotationDetails = async () => {
    try {
      const response = await fetch(`/api/quotation/${id}`);
      if (!response.ok) throw new Error("Failed to fetch quotation details");
      const data = await response.json();
      setQuotation(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!quotation) return;

    // Prepare data for the utility function
    const billing = typeof quotation.billing === 'string' ? JSON.parse(quotation.billing) : quotation.billing;
    
    // Parse warranty details if available
    let warrantyData = {
      solarPanelWarranty: 'N/A',
      ongridInverterWarranty: 'N/A',
      ongridInverterLocalWarranty: 'N/A'
    };

    if (conditions && conditions.warrantyDetails) {
      try {
        const details = typeof conditions.warrantyDetails === 'string' ? JSON.parse(conditions.warrantyDetails) : conditions.warrantyDetails;
        if (Array.isArray(details)) {
          warrantyData = {
            solarPanelWarranty: details[0]?.text || details[0] || 'N/A',
            ongridInverterWarranty: details[1]?.text || details[1] || 'N/A',
            ongridInverterLocalWarranty: details[2]?.text || details[2] || 'N/A'
          };
        }
      } catch (e) {
        console.error("Error parsing warranty details", e);
      }
    }

    const pdfData = {
      quotationItems: quotation.items.map(item => ({
        description: item.product_name,
        brand: '-',
        model: '-',
        qty: item.quantity,
        rate: item.price,
        amount: item.quantity * item.price
      })),
      warrantyDetails: warrantyData,
      productionDetails: {
        monthlyProduction: quotation.monthly_production,
        annualProduction: quotation.annual_production,
        annualSaving: quotation.annual_saving,
        backupPeriod: quotation.backup_period
      },
      totals: {
        withoutNetMetering: quotation.total_without_net_metering,
        withNetMetering: quotation.total_with_net_metering
      },
      orderDetails: {
        name: `${billing?.firstName || ''} ${billing?.lastName || ''}`,
        email: quotation.email,
        phone: quotation.phone,
        dateCreated: new Date(quotation.date_created).toLocaleDateString(),
        time: quotation.time_created,
        status: quotation.status,
        billing: billing
      }
    };

    const url = generateQuotationPDF(pdfData);
    
    // Create a link and click it to download
    const link = document.createElement('a');
    link.href = url;
    link.download = `quotation_${quotation.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!quotation) return <div className="text-gray-500 p-4">Quotation not found</div>;

  const billing = typeof quotation.billing === 'string' ? JSON.parse(quotation.billing) : quotation.billing;
  const shipping = typeof quotation.shipping === 'string' ? JSON.parse(quotation.shipping) : quotation.shipping;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <FileText className="mr-2" /> Quotation #{quotation.id}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold 
            ${quotation.status === 'pending' ? 'bg-yellow-400 text-yellow-900' : 
              quotation.status === 'completed' ? 'bg-green-400 text-green-900' : 
              'bg-gray-200 text-gray-800'}`}>
            {quotation.status}
          </span>
        </div>

        <div className="p-6 space-y-8">
          {/* Customer & Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Customer Information</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Name</p>
                  <p className="font-medium">{billing?.firstName} {billing?.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium">{quotation.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium">{quotation.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date Created</p>
                  <p className="font-medium">{new Date(quotation.date_created).toLocaleDateString()} {quotation.time_created}</p>
                </div>
              </div>
              
              <div className="mt-4">
                 <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Billing Address</p>
                 <p className="text-sm">{billing?.address}, {billing?.city}, {billing?.state} {billing?.postcode}</p>
              </div>
              <div className="mt-4">
                 <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">Shipping Address</p>
                 <p className="text-sm">{shipping?.address}, {shipping?.city}, {shipping?.state} {shipping?.postcode}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">System Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Monthly Production</p>
                  <p className="font-medium">{quotation.monthly_production} kWh</p>
                </div>
                <div>
                  <p className="text-gray-500">Annual Production</p>
                  <p className="font-medium">{quotation.annual_production} kWh</p>
                </div>
                <div>
                  <p className="text-gray-500">Annual Saving</p>
                  <p className="font-medium text-green-600">${quotation.annual_saving}</p>
                </div>
                <div>
                  <p className="text-gray-500">Backup Period</p>
                  <p className="font-medium">{quotation.backup_period || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quotation Items</h2>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {quotation.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.product_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Conditions Section */}
          {conditions && (
            <div className="space-y-6 border-t pt-6">
              <h2 className="text-lg font-semibold text-gray-800">Terms & Conditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {conditions.warrantyDetails && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Warranty Details</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {(() => {
                        try {
                          const items = typeof conditions.warrantyDetails === 'string' ? JSON.parse(conditions.warrantyDetails) : conditions.warrantyDetails;
                          return Array.isArray(items) ? items.map((item, i) => <li key={i}>{typeof item === 'string' ? item : item.text}</li>) : <li>{String(items)}</li>;
                        } catch (e) { return <li>{String(conditions.warrantyDetails)}</li>; }
                      })()}
                    </ul>
                  </div>
                )}
                {conditions.termsConditions && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-700 mb-2">Terms & Conditions</h3>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {(() => {
                        try {
                          const items = typeof conditions.termsConditions === 'string' ? JSON.parse(conditions.termsConditions) : conditions.termsConditions;
                          return Array.isArray(items) ? items.map((item, i) => <li key={i}>{typeof item === 'string' ? item : item.text}</li>) : <li>{String(items)}</li>;
                        } catch (e) { return <li>{String(conditions.termsConditions)}</li>; }
                      })()}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full md:w-1/2 lg:w-1/3 bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total (Without Net Metering)</span>
                <span className="font-medium">${quotation.total_without_net_metering}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-blue-600 border-t pt-2">
                <span>Total (With Net Metering)</span>
                <span>${quotation.total_with_net_metering}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
            <Link href="/admin/file" className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Quotations
            </Link>
            
            <div className="flex gap-4 w-full sm:w-auto">
              {/* "Go Change Quotations" - Assuming this means Edit or Create New. Since I don't have an Edit page, I'll link to Dashboard or just keep it as a placeholder/back button. 
                  The user said "one for go chnage quotations". I'll interpret this as "Edit" if possible, or "Back" if not. 
                  I'll add a button that links to the dashboard where they might create a new one, or just a secondary back button. 
                  Actually, let's make it a "Create New" button for now, or just a "Back" button is enough? 
                  User said: "and in the end this give us a two button one for go chnage quotations and one for download into pdf file".
                  "Go change quotations" sounds like "Go to manage quotations" or "Edit".
                  I'll add a button "Manage Quotations" linking to /admin/file (which is the list).
              */}
               <Link href="/admin/file" className="w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center transition-colors">
                 Go Change Quotations
               </Link>

              <button 
                onClick={generatePDF}
                className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center transition-colors shadow-md"
              >
                <Download className="w-4 h-4 mr-2" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
