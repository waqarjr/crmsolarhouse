'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Clock } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const OrderDetailsComponent = ({ onCustomerSelect }) => {
  const [dateCreated, setDateCreated] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [status, setStatus] = useState('pending');
  const [customerSearch, setCustomerSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [shipping, setShipping] = useState(false);

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
        const response = await axios.get('/api/customers', {
          params: { search: searchTerm }
        });
        setCustomers(response.data);
        setShowCustomerDropdown(true);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setIsLoadingCustomers(false);
      }
    }, 300);
  };

  const handleCustomerSearchChange = (value) => {
    setCustomerSearch(value);
    if (value.trim()) {
      fetchCustomers(value);
    } else {
      setCustomers([]);
      setShowCustomerDropdown(false);
    }
  };

  // Validation schemas
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    streetAddress: Yup.string().required('Street address is required'),
    townCity: Yup.string().required('Town/City is required'),
    state: Yup.string().required('State is required'),
    postcode: Yup.string().required('Postcode is required'),
    phone: Yup.string().required('Phone is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
  });

  const validationShipping = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    streetAddress: Yup.string().required('Street address is required'),
    townCity: Yup.string().required('Town/City is required'),
    state: Yup.string().required('State is required'),
    postcode: Yup.string().required('Postcode is required'),
  });

  // Billing form
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      streetAddress: '',
      townCity: '',
      state: '',
      postcode: '',
      phone: '',
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log('Billing Data:', values);
        
        // If shipping is enabled, validate shipping form
        if (shipping) {
          const shippingErrors = await formikShipping.validateForm();
          
          if (Object.keys(shippingErrors).length > 0) {
            formikShipping.setTouched(
              Object.keys(formikShipping.initialValues).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {}
              )
            );
            return;
          }
          console.log('Shipping Data:', formikShipping.values);
        }

        // TODO: Submit to API
        alert('Order submitted successfully!');
        // resetForm();
        // formikShipping.resetForm();
      } catch (error) {
        console.error('Error submitting order:', error);
      }
    },
  });

  // Shipping form
  const formikShipping = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      streetAddress: '',
      townCity: '',
      state: '',
      postcode: '',
    },
    validationSchema: validationShipping,
  });

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(`${customer.first_name} ${customer.last_name} (#${customer.id} – ${customer.email})`);
    setShowCustomerDropdown(false);
    setShowForm(true);

    // Auto-fill billing form
    const billing = customer.billing || {};
    formik.setValues({
      firstName: billing.first_name || customer.first_name || '',
      lastName: billing.last_name || customer.last_name || '',
      streetAddress: billing.address_1 || '',
      townCity: billing.city || '',
      state: billing.state || '',
      postcode: billing.postcode || '',
      phone: billing.phone || '',
      email: customer.email || '',
    });

    // Auto-fill shipping form
    const shippingData = customer.shipping || {};
    formikShipping.setValues({
      firstName: shippingData.first_name || '',
      lastName: shippingData.last_name || '',
      streetAddress: shippingData.address_1 || '',
      townCity: shippingData.city || '',
      state: shippingData.state || '',
      postcode: shippingData.postcode || '',
    });

    // Pass customer data to parent component if callback provided
    if (onCustomerSelect) {
      onCustomerSelect({
        // Customer Info
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`,
        email: customer.email,
        phone: billing.phone || '',
        
        // Order Details
        dateCreated,
        time: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
        status,
        
        // Billing Address
        billing: {
          firstName: billing.first_name || customer.first_name || '',
          lastName: billing.last_name || customer.last_name || '',
          address: billing.address_1 || '',
          city: billing.city || '',
          state: billing.state || '',
          postcode: billing.postcode || '',
          phone: billing.phone || '',
          email: customer.email || ''
        },
        
        // Shipping Address
        shipping: shippingData.address_1 ? {
          firstName: shippingData.first_name || '',
          lastName: shippingData.last_name || '',
          address: shippingData.address_1 || '',
          city: shippingData.city || '',
          state: shippingData.state || '',
          postcode: shippingData.postcode || ''
        } : null
      });
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Payment' },
    { value: 'processing', label: 'Processing' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ];

  const pakistanStates = [
    'Azad Kashmir',
    'Balochistan',
    'FATA',
    'Gilgit Baltistan',
    'Islamabad Capital Territory',
    'Khyber Pakhtunkhwa',
    'Punjab',
    'Sindh'
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-6">
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
                <input 
                  type="date" 
                  value={dateCreated} 
                  onChange={(e) => setDateCreated(e.target.value)} 
                  className="w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" 
                />
              </div>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Time
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input 
                    type="number" 
                    min="0" 
                    max="23" 
                    value={hours} 
                    onChange={(e) => setHours(Math.min(23, Math.max(0, Number(e.target.value) || 0)))} 
                    placeholder="HH" 
                    className="w-full px-auto py-3 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500 focus:outline-none transition" 
                  />
                </div>
                <span className="text-2xl font-bold text-gray-400">:</span>
                <input 
                  type="number" 
                  min="0" 
                  max="59" 
                  value={minutes} 
                  onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value) || 0)))} 
                  placeholder="MM" 
                  className="flex-1 w-full px-3 py-3 border-2 border-gray-300 rounded-lg text-center focus:border-blue-500 focus:outline-none transition" 
                />
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
          <input 
            type="text" 
            value={customerSearch} 
            onChange={(e) => handleCustomerSearchChange(e.target.value)} 
            onFocus={() => customers.length > 0 && setShowCustomerDropdown(true)} 
            placeholder="Search customers..." 
            className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition" 
          />
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
                <div 
                  key={customer.id} 
                  onClick={() => handleCustomerSelect(customer)} 
                  className="p-4 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0 transition"
                >
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

      {/* Customer Form - Only visible when customer is selected */}
      {showForm && selectedCustomer && (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* ==================== BILLING DETAILS ==================== */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Billing Details</h2>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 border-gray-300 focus:border-blue-500 ${formik.touched.firstName && formik.errors.firstName ? 'border-red-500' : ''}`}
                    placeholder=" "
                  />
                  <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                    First Name <span className="text-red-500">*</span>
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 border-gray-300 focus:border-blue-500 ${formik.touched.lastName && formik.errors.lastName ? 'border-red-500' : ''}`}
                    placeholder=" "
                  />
                  <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 border-gray-300 focus:border-blue-500 ${formik.touched.email && formik.errors.email ? 'border-red-500' : ''}`}
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                  Email Address <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 border-gray-300 focus:border-blue-500 ${formik.touched.phone && formik.errors.phone ? 'border-red-500' : ''}`}
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                  Phone <span className="text-red-500">*</span>
                </label>
              </div>

              {/* Street Address */}
              <div className="relative">
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formik.values.streetAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 border-gray-300 focus:border-blue-500 ${formik.touched.streetAddress && formik.errors.streetAddress ? 'border-red-500' : ''}`}
                  placeholder=" "
                />
                <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                  Street Address <span className="text-red-500">*</span>
                </label>
              </div>

              {/* City, Postcode, State */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  id="townCity"
                  name="townCity"
                  value={formik.values.townCity}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="City"
                  className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                    formik.touched.townCity && formik.errors.townCity ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={formik.values.postcode}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Postcode / ZIP"
                  className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                    formik.touched.postcode && formik.errors.postcode ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                <select
                  id="state"
                  name="state"
                  value={formik.values.state}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                    formik.touched.state && formik.errors.state ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  <option value="">State</option>
                  {pakistanStates.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ==================== SHIPPING DETAILS ==================== */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shipping}
                    onChange={(e) => setShipping(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Different address?</span>
                </label>
              </div>

              {shipping ? (
                <>
                  {/* Shipping First Name & Last Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      id="shippingFirstName"
                      name="firstName"
                      value={formikShipping.values.firstName}
                      onChange={formikShipping.handleChange}
                      onBlur={formikShipping.handleBlur}
                      placeholder="First Name"
                      className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                        formikShipping.touched.firstName && formikShipping.errors.firstName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <input
                      type="text"
                      id="shippingLastName"
                      name="lastName"
                      value={formikShipping.values.lastName}
                      onChange={formikShipping.handleChange}
                      onBlur={formikShipping.handleBlur}
                      placeholder="Last Name"
                      className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                        formikShipping.touched.lastName && formikShipping.errors.lastName ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                  </div>

                  {/* Shipping Street Address */}
                  <input
                    type="text"
                    id="shippingStreetAddress"
                    name="streetAddress"
                    value={formikShipping.values.streetAddress}
                    onChange={formikShipping.handleChange}
                    onBlur={formikShipping.handleBlur}
                    placeholder="Street Address"
                    className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition ${
                      formikShipping.touched.streetAddress && formikShipping.errors.streetAddress ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                    }`}
                  />

                  {/* City, Postcode, State */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      id="shippingTownCity"
                      name="townCity"
                      value={formikShipping.values.townCity}
                      onChange={formikShipping.handleChange}
                      onBlur={formikShipping.handleBlur}
                      placeholder="City"
                      className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                        formikShipping.touched.townCity && formikShipping.errors.townCity ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <input
                      type="text"
                      id="shippingPostcode"
                      name="postcode"
                      value={formikShipping.values.postcode}
                      onChange={formikShipping.handleChange}
                      onBlur={formikShipping.handleBlur}
                      placeholder="Postcode / ZIP"
                      className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                        formikShipping.touched.postcode && formikShipping.errors.postcode ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    />
                    <select
                      id="shippingState"
                      name="state"
                      value={formikShipping.values.state}
                      onChange={formikShipping.handleChange}
                      onBlur={formikShipping.handleBlur}
                      className={`px-4 py-3 border-2 rounded-lg outline-none transition ${
                        formikShipping.touched.state && formikShipping.errors.state ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'
                      }`}
                    >
                      <option value="">State</option>
                      {pakistanStates.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-600">
                  <p className="font-medium">Shipping address is the same as billing address</p>
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default OrderDetailsComponent;
