'use client'
import React, { useState, useEffect } from 'react';
import { Download, Save } from 'lucide-react';
import api from '@/lib/api';

// Import all components
import QuotationHeader from '@/components/dashboard/QuotationHeader';
import ProductSearchBox from '@/components/dashboard/ProductSearchBox';
import QuotationTable from '@/components/dashboard/QuotationTable';
import TotalsSummary from '@/components/dashboard/TotalsSummary';
import WarrantyForm from '@/components/dashboard/WarrantyForm';
import ProductionDetailsForm from '@/components/dashboard/ProductionDetailsForm';
import PDFDownloadModal from '@/components/dashboard/PDFDownloadModal';
import { generateQuotationPDF } from "@/utils/generateQuotationPDF";

const SolarQuotationSystem = () => {
  // State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quotationItems, setQuotationItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  
  const [warrantyDetails, setWarrantyDetails] = useState({
    solarPanelWarranty: '25 years performance warranty of Solar Panels',
    ongridInverterWarranty: '5 years company (Solis) warranty of Ongrid Solar Inverter',
    ongridInverterLocalWarranty: '10 years local company (Auxcol) warranty of Ongrid Solar Inverter'
  });
  
  const [productionDetails, setProductionDetails] = useState({
    monthlyProduction: 3150,
    annualProduction: 38283,
    annualSaving: 318476,
    backupPeriod: 1.27
  });

  // Fetch Products from WooCommerce API using axios
  const fetchProducts = async (search = '') => {
    if (!search || search.length < 3) return [];
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/products', {
        params: {
          search: search,
          per_page: 10
        }
      });
      
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to fetch products. Please check your API credentials.');
      setIsLoading(false);
      return [];
    }
  };



  // Handle Search Input with Debouncing
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchTerm.length > 2) {
        const results = await fetchProducts(searchTerm);
        setSearchResults(results);
        setShowDropdown(results.length > 0);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  // Extract Brand from Product Attributes
  const extractBrand = (product) => {
    if (!product.attributes || product.attributes.length === 0) return '';
    
    const brandAttribute = product.attributes.find(
      attr => attr.name.toLowerCase() === 'brand' || attr.name.toLowerCase() === 'brands'
    );
    
    return brandAttribute?.options?.[0] || '';
  };

  // Add Product to Quotation
  const addProductToQuotation = (product) => {
    const newItem = {
      id: Date.now(),
      productId: product.id,
      description: product.name || '',
      brand: extractBrand(product),
      model: product.sku || '',
      qty: 1,
      rate: parseFloat(product.price) || 0,
      amount: parseFloat(product.price) || 0
    };
    
    setQuotationItems([...quotationItems, newItem]);
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  
  
  // Update Quotation Item
  const updateItem = (id, field, value) => {
    setQuotationItems(quotationItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate amount when qty or rate changes
        if (field === 'qty' || field === 'rate') {
          const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(updatedItem.qty) || 0;
          const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(updatedItem.rate) || 0;
          updatedItem.amount = qty * rate;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // Remove Item from Quotation
  const removeItem = (id) => {
    setQuotationItems(quotationItems.filter(item => item.id !== id));
  };

  // Calculate Total Without Net-metering
  const calculateTotalWithoutNetMetering = () => {
    return quotationItems
      .filter(item => !item.description.toLowerCase().includes('net-metering') && 
                     !item.description.toLowerCase().includes('net metering'))
      .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  // Calculate Total With Net-metering
  const calculateTotalWithNetMetering = () => {
    return quotationItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };



  // Generate PDF
  const generatePDF = () => {
    // Calculate totals here before passing to PDF generator
    const totals = {
      withoutNetMetering: calculateTotalWithoutNetMetering(),
      withNetMetering: calculateTotalWithNetMetering()
    };

    const url = generateQuotationPDF({
      quotationItems,
      warrantyDetails,
      productionDetails,
      totals // Pass the calculated totals object
    });

    setPdfUrl(url);
    setShowPDFModal(true);
  };

  // Clear All Data
  const clearQuotation = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setQuotationItems([]);
      setSearchTerm('');
      setSearchResults([]);
      setShowDropdown(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Component */}
        <QuotationHeader />

        <div className="p-4 md:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Product Search Component */}
          <ProductSearchBox searchTerm={searchTerm} onSearchChange={setSearchTerm} searchResults={searchResults} showDropdown={showDropdown} setShowDropdown={setShowDropdown} isLoading={isLoading} onProductSelect={addProductToQuotation} extractBrand={extractBrand}/>

          {/* Action Buttons */}
          <div className="mb-6 flex flex-wrap gap-3">
            <button onClick={clearQuotation} className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg font-semibold hover:bg-red-100 transition">
              Clear All Items
            </button>
            <div className="flex-1"></div>
            <span className="text-sm text-gray-500 flex items-center">
              Total Items: <strong className="ml-2 text-gray-800">{quotationItems.length}</strong>
            </span>
          </div>

          {/* Quotation Table Component */}
          <QuotationTable quotationItems={quotationItems} onUpdateItem={updateItem} onRemoveItem={removeItem}/>

          {/* Totals Summary Component */}
          <TotalsSummary totalWithoutNetMetering={calculateTotalWithoutNetMetering()} totalWithNetMetering={calculateTotalWithNetMetering()}/>

          {/* Warranty Form Component */}
          <WarrantyForm warrantyDetails={warrantyDetails} onChange={setWarrantyDetails}/>

          {/* Production Details Component */}
          <ProductionDetailsForm productionDetails={productionDetails} onChange={setProductionDetails}/>

          {/* Final Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <button onClick={generatePDF} className="flex-1 min-w-[200px] bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2">
              <Download size={20} />
              Download Quotation PDF
            </button>
          </div>

          {/* Footer Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Connected to:</strong> solarhouse.pk WooCommerce API
            </p>
          </div>
        </div>
      </div>

      {/* PDF Download Modal Component */}
      <PDFDownloadModal isOpen={showPDFModal} onClose={() => setShowPDFModal(false)} pdfUrl={pdfUrl} fileName={`solar-quotation-${Date.now()}.txt`}/>
    </div>
  );
};

export default SolarQuotationSystem;