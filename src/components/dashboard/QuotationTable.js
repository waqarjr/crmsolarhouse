'use client';
import React from 'react';
import { Search, Trash2, Package, Plus } from 'lucide-react';

const QuotationTable = ({ quotationItems, onUpdateItem, onRemoveItem, setQuotationItems }) => {
  
  // Function to add a new empty item manually
  const addNewItem = () => {
    const newItem = {
      id: Date.now(),
      description: '',
      brand: '',
      model: '',
      qty: 1,
      rate: 0,
      amount: 0
    };
    setQuotationItems([...quotationItems, newItem]);
  };

  // Wrapper to handle updates for both search box items and manual items
  const handleUpdateItem = (id, field, value) => {
    if (onUpdateItem) {
      // Use parent's update function (for search box items)
      onUpdateItem(id, field, value);
    } else if (setQuotationItems) {
      // Manual update with local calculation (for manual items)
      setQuotationItems(items =>
        items.map(item => {
          if (item.id === id) {
            const updatedItem = { ...item, [field]: value };
            
            // Recalculate amount if qty or rate changes
            if (field === 'qty' || field === 'rate') {
              const qty = field === 'qty' ? parseFloat(value) || 0 : parseFloat(item.qty) || 0;
              const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(item.rate) || 0;
              updatedItem.amount = qty * rate;
            }
            
            return updatedItem;
          }
          return item;
        })
      );
    }
  };
  
  return (
    <div className="mb-8">
      {/* Add New Item Button */}
      {setQuotationItems && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={addNewItem}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg"
          >
            <Plus size={20} />
            Add New Item
          </button>
        </div>
      )}
      
      {quotationItems.length === 0 ? (
        <div className="p-12 bg-gray-50 rounded-xl border-2 border-gray-200 text-center">
          <div className="flex flex-col items-center gap-3">
            <Search size={64} className="text-gray-300" />
            <p className="text-xl font-semibold text-gray-700">No items added yet</p>
            <p className="text-sm text-gray-500">
              {setQuotationItems 
                ? 'Search and select products from WooCommerce or click "Add New Item" to create manually'
                : 'Search and select products from WooCommerce to add them'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {quotationItems.map((item, index) => (
            <div
              key={item.id}
              className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 transition-all "
            >
              {/* Header with Serial Number and Delete Button */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Package size={20} className="text-blue-600" />
                    <span className="font-semibold text-lg">Item #{index + 1}</span>
                  </div>
                </div>
                <button onClick={() => onRemoveItem(item.id)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition border-2 border-red-200 hover:border-red-300" title="Remove item">
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Description */}
                <div className="lg:col-span-3">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product Description
                  </label>
                    <input type="text" value={item.description} onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)} placeholder="Enter product description" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition" />
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand
                  </label>
                  <input type="text" value={item.brand} onChange={(e) => handleUpdateItem(item.id, 'brand', e.target.value)} placeholder="Brand name" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition" />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Model / Specification
                  </label>
                  <input type="text" value={item.model} onChange={(e) => handleUpdateItem(item.id, 'model', e.target.value)} placeholder="Model or spec" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition" />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input value={item.qty} onChange={(e) => handleUpdateItem(item.id, 'qty', e.target.value)} min="1" placeholder="Qty" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition" />
                </div>

                {/* Rate */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rate (PKR)
                  </label>
                  <input type="number" value={item.rate} onChange={(e) => handleUpdateItem(item.id, 'rate', e.target.value)} min="0" step="0.01" placeholder="Rate" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg transition" />
                </div>

                {/* Amount (Read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Amount
                  </label>
                  <div className="w-full px-4 py-3 bg-green-50 border-2 border-green-200 rounded-lg font-bold text-green-700 text-lg flex items-center">
                    PKR {item.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationTable;
