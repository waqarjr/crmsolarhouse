'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, Save } from 'lucide-react';

// Import all components
import QuotationHeader from '@/components/quotation/QuotationHeader';
import ProductSearchBox from '@/components/quotation/ProductSearchBox';
import QuotationTable from '@/components/quotation/QuotationTable';
import TotalsSummary from '@/components/quotation/TotalsSummary';
import ProductionDetailsForm from '@/components/quotation/ProductionDetailsForm';
import OrderDetailsComponent from '@/components/quotation/OrderDetailsComponent';

const SolarQuotationSystem = () => {
  // State Management
  const [quotationItems, setQuotationItems] = useState([]);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [productionDetails, setProductionDetails] = useState({
    monthlyProduction: 3150,
    annualProduction: 38283,
    annualSaving: 318476,
    backupPeriod: 1.27
  });

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
    // Clear any previous messages when adding items
    setError(null);
    setSuccessMessage(null);
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

  // Totals State (managed by TotalsSummary)
  const [totals, setTotals] = useState({
    withoutNetMetering: 0,
    withNetMetering: 0
  });

  // Save Data with validation, loading, and error handling
  const insertData = async () => {
    // Clear previous messages
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!quotationItems || quotationItems.length === 0) {
      setError('Please add at least one product to the quotation');
      return;
    }

    if (!orderDetails) {
      setError('Please select or enter customer details');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/quotation', { 
        quotationItems, 
        productionDetails, 
        totals, 
        orderDetails 
      });

      if (response.data.success) {
        setSuccessMessage(`Quotation saved successfully! Order ID: ${response.data.orderId}`);
        
        // Reset form after successful save
        setTimeout(() => {
          setQuotationItems([]);
          setOrderDetails(null);
          setProductionDetails({
            monthlyProduction: 3150,
            annualProduction: 38283,
            annualSaving: 318476,
            backupPeriod: 1.27
          });
          setSuccessMessage(null);
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to save quotation');
      }
    } catch (err) {
      console.error('Error saving quotation:', err);
      setError(err.response?.data?.error || err.message || 'An error occurred while saving the quotation');
    } finally {
      setLoading(false);
    }
  };

  // Clear All Data
  const clearQuotation = () => {
    if (window.confirm('Are you sure you want to clear all data?')) {
      setQuotationItems([]);
      setOrderDetails(null);
      setProductionDetails({
        monthlyProduction: 3150,
        annualProduction: 38283,
        annualSaving: 318476,
        backupPeriod: 1.27
      });
      setError(null);
      setSuccessMessage(null);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <QuotationHeader />
        <div className="p-4 md:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">{error}</div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg text-green-700 flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">{successMessage}</div>
            </div>
          )}

          <OrderDetailsComponent onCustomerSelect={setOrderDetails}/>
          
          <div className="mb-6"></div>
          
          <ProductSearchBox onProductSelect={addProductToQuotation} />

          <div className="mb-6 flex flex-wrap gap-3">
            <button 
              onClick={clearQuotation}
              disabled={loading}
              className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-200 rounded-lg font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All Items
            </button>
            <div className="flex-1"></div>
            <span className="text-sm text-gray-500 flex items-center">
              Total Items: <strong className="ml-2 text-gray-800">{quotationItems.length}</strong>
            </span>
          </div>

          <QuotationTable 
            quotationItems={quotationItems} 
            onUpdateItem={updateItem} 
            onRemoveItem={removeItem} 
            setQuotationItems={setQuotationItems}
          />

          <TotalsSummary 
            quotationItems={quotationItems} 
            onTotalsChange={setTotals}
          />

          <ProductionDetailsForm 
            productionDetails={productionDetails} 
            onChange={setProductionDetails}
          />

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={insertData}
              disabled={loading}
              className="flex-1 min-w-[200px] bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving Quotation...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Quotation
                </>
              )}
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              <strong>Connected to:</strong> solarhouse.pk WooCommerce API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarQuotationSystem;