'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import axios from 'axios';

const ProductSearchBox = ({ onProductSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const boxRef = useRef(null);

  // Extract Brand Helper
  const extractBrand = (product) => {
    if (!product.attributes || product.attributes.length === 0) return '';
    
    const brandAttribute = product.attributes.find(
      attr => attr.name.toLowerCase() === 'brand' || attr.name.toLowerCase() === 'brands'
    );
    
    return brandAttribute?.options?.[0] || '';
  };

  // Fetch Products
  const fetchProducts = async (search = '') => {
    if (!search || search.length < 3) return [];
    
    setIsLoading(true);
    
    try {
      const response = await axios.get('/api/products', {
        params: { search, per_page: 10 }
      });
      
      setIsLoading(false);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
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

  const handleProductSelect = (product) => {
    onProductSelect(product);
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  return (
    <div className="mb-8 relative" ref={boxRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Search Products from WooCommerce</label>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />

        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          onFocus={() => searchResults.length > 0 && setShowDropdown(true)} 
          placeholder="Type at least 3 characters to search (e.g., solar panel, inverter, cable)..." 
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg transition"
        />

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
            <div key={product.id} onClick={() => handleProductSelect(product)} className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 transition">
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
      {showDropdown  && !isLoading && searchResults.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl p-4 text-center text-gray-500">
          No products found. Try different keywords.
        </div>
      )}

    </div>
  );
};

export default ProductSearchBox;
