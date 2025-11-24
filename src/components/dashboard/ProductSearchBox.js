'use client';
import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const ProductSearchBox = ({ searchTerm, onSearchChange, searchResults, showDropdown, isLoading, onProductSelect, extractBrand, setShowDropdown }) => {
  
  const boxRef = useRef(null);

  //  Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-8 relative" ref={boxRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products from WooCommerce</label>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />

        <input type="text" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} onFocus={() => searchResults.length > 0 && setShowDropdown(true)} 
        placeholder="Type at least 3 characters to search (e.g., solar panel, inverter, cable)..." className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg transition"/>

        {isLoading && (
          <div className="absolute right-4 top-3.5">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {searchResults.map((product) => (
            <div key={product.id} onClick={() => onProductSelect(product)} className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition">
              <div className="font-semibold text-gray-800">{product.name}</div>
              <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-2">
                {product.sku && <span>SKU: {product.sku}</span>}
                <span>•</span>
                <span className="text-green-600 font-semibold">Price: PKR {parseFloat(product.price).toLocaleString()}</span>
                {extractBrand(product) && <><span>•</span><span>Brand: {extractBrand(product)}</span></>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showDropdown && searchTerm.length > 2 && !isLoading && searchResults.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
          No products found. Try different keywords.
        </div>
      )}

    </div>
  );
};

export default ProductSearchBox;
