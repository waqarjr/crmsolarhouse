'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Clock } from 'lucide-react';
import api from '@/lib/api';

const OrderDetailsComponent = () => {
  const [dateCreated, setDateCreated] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [status, setStatus] = useState('pending');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customerBoxRef = useRef(null);
  const fetchTimeout = useRef(null);

  // Initialize date and time
  useEffect(() => {
    const now = new Date();
    setDateCreated(now.toISOString().split('T')[0]);
    setHours(now.getHours());
    setMinutes(now.getMinutes());
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (customerBoxRef.current && !customerBoxRef.current.contains(event.target)) {
        setShowCustomerDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch customers
  const fetchCustomers = (searchTerm) => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current);

    fetchTimeout.current = setTimeout(async () => {
      setIsLoadingCustomers(true);
      try {
        const response = await api.get(`/api/woocommerce/customers?search=${encodeURIComponent(searchTerm)}`);
        if (response.ok) {
          const data = await response.json();
          setCustomers(data);
          setShowCustomerDropdown(true);
        }
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoadingCustomers(false);
      }
    }, 300);
  };

  const handleCustomerSearchChange = (value) => {
    setCustomerSearch(value);
    fetchCustomers(value);
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.first_name} ${customer.last_name} (#${customer.id} – ${customer.email})`);
    setShowCustomerDropdown(false);
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Payment' },
    { value: 'processing', label: 'Processing' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
  <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Order Details</h2>

  {/* First Row – Date/Time + Status */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
    {/* Date & Time */}
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Date Created
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input type="date" value={dateCreated} onChange={(e) => setDateCreated(e.target.value)} className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" />
          </div>
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Time
          </label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-3.5 text-gray-400" size={20} />
              <input type="number" min="0" max="23" value={hours} onChange={(e) => setHours(Math.min(23, Math.max(0, Number(e.target.value) || 0)))} placeholder="HH" className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500 focus:outline-none transition" />
            </div>
            <span className="text-2xl font-bold text-gray-400">:</span>
            <input type="number" min="0" max="59" value={minutes} onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value) || 0)))} placeholder="MM" className="flex-1 w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500 focus:outline-none transition" />
          </div>
        </div>
      </div>
    </div>

    {/* Status */}
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  </div>

  {/* Customer Search */}
  <div className="relative mb-6" ref={customerBoxRef}>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Customer
    </label>
    <div className="relative">
      <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
      <input type="text" value={customerSearch} onChange={(e) => handleCustomerSearchChange(e.target.value)} onFocus={() => customers.length > 0 && setShowCustomerDropdown(true)} placeholder="Search customers..." className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" />
      {isLoadingCustomers && (
        <div className="absolute right-3 top-3.5">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>

    {/* Dropdown */}
    {showCustomerDropdown && (
      <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl max-h-96 overflow-y-auto">
        {customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.id} onClick={() => handleCustomerSelect(customer)} className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition">
              <div className="font-semibold text-gray-800">
                {customer.first_name} {customer.last_name} (#{customer.id} – {customer.email})
              </div>
              {customer.billing?.phone && (
                <div className="text-sm text-gray-600 mt-1">
                  Phone: {customer.billing.phone}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No customers found.
          </div>
        )}
      </div>
    )}
  </div>

  {/* Selected Customer Card */}
  {selectedCustomer && (
    <div className="p-4 sm:p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-700 mb-3">Selected Customer</h3>
      <div className="space-y-2 text-sm sm:text-base">
        <p>
          <span className="font-semibold">Name:</span>{" "}
          {selectedCustomer.first_name} {selectedCustomer.last_name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {selectedCustomer.email}
        </p>
        <p>
          <span className="font-semibold">Customer ID:</span> #
          {selectedCustomer.id}
        </p>
      </div>
    </div>
  )}
</div>
  );
};

export default OrderDetailsComponent;
