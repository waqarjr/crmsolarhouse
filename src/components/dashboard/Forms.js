'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';

export const Forms = () => {
  // Billing Fields
  const [billing, setBilling] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    country: 'PK',
    state: '',
  });

  // Shipping Fields (can be same as billing or different)
  const [shipping, setShipping] = useState({
    first_name: '',
    last_name: '',
    address_1: '',
    address_2: '',
    city: '',
    postcode: '',
    country: 'PK',
    state: '',
  });

  const [sameAsBilling, setSameAsBilling] = useState(true);

  // Sync shipping with billing when checkbox is checked
  const handleSameAsBilling = (e) => {
    const checked = e.target.checked;
    setSameAsBilling(checked);
    if (checked) {
      setShipping({
        first_name: billing.first_name,
        last_name: billing.last_name,
        address_1: billing.address_1,
        address_2: billing.address_2,
        city: billing.city,
        postcode: billing.postcode,
        country: billing.country,
        state: billing.state,
      });
    }
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling(prev => ({ ...prev, [name]: value }));

    if (sameAsBilling) {
      setShipping(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping(prev => ({ ...prev, [name]: value }));
  };

  // Simple validation helper
  const isValid = (value) => value.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* ==================== BILLING DETAILS ==================== */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Billing Details</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                name="first_name"
                value={billing.first_name}
                onChange={handleBillingChange}
                className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 
                  ${isValid(billing.first_name)
                    ? 'border-green-500 focus:border-green-600'
                    : 'border-gray-300 focus:border-blue-500'
                  } ${!isValid(billing.first_name) && billing.first_name !== '' ? 'border-red-500' : ''}`}
                placeholder=" "
                required
              />
              <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                First Name <span className="text-red-500">*</span>
              </label>
              {isValid(billing.first_name) && (
                <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                name="last_name"
                value={billing.last_name}
                onChange={handleBillingChange}
                className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 
                  ${isValid(billing.last_name)
                    ? 'border-green-500 focus:border-green-600'
                    : 'border-gray-300 focus:border-blue-500'
                  } ${!isValid(billing.last_name) && billing.last_name !== '' ? 'border-red-500' : ''}`}
                placeholder=" "
              />
              <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
                Last Name
              </label>
            </div>
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              value={billing.email}
              onChange={handleBillingChange}
              className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 
                ${isValid(billing.email) && billing.email.includes('@')
                  ? 'border-green-500 focus:border-green-600'
                  : 'border-gray-300 focus:border-blue-500'
                } ${billing.email && !billing.email.includes('@') ? 'border-red-500' : ''}`}
              placeholder=" "
              required
            />
            <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
              Email Address <span className="text-red-500">*</span>
            </label>
            {isValid(billing.email) && billing.email.includes('@') && (
              <Check className="absolute right-3 top-3.5 text-green-500" size={20} />
            )}
          </div>

          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={billing.phone}
              onChange={handleBillingChange}
              className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 
                ${isValid(billing.phone)
                  ? 'border-green-500 focus:border-green-600'
                  : 'border-gray-300 focus:border-blue-500'
                } ${billing.phone && billing.phone.length < 10 ? 'border-red-500' : ''}`}
              placeholder=" "
            />
            <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
              Phone
            </label>
          </div>

          <div className="relative">
            <input
              type="text"
              name="address_1"
              value={billing.address_1}
              onChange={handleBillingChange}
              className={`peer w-full px-4 py-3 border-2 rounded-lg outline-none transition-all duration-200 
                ${isValid(billing.address_1)
                  ? 'border-green-500 focus:border-green-600'
                  : 'border-gray-300 focus:border-blue-500'
                } ${!isValid(billing.address_1) && billing.address_1 !== '' ? 'border-red-500' : ''}`}
              placeholder=" "
              required
            />
            <label className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-600">
              Street Address <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              value={billing.city}
              onChange={handleBillingChange}
              placeholder="City"
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
            />
            <input
              type="text"
              name="postcode"
              value={billing.postcode}
              onChange={handleBillingChange}
              placeholder="Postcode / ZIP"
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
            />
            <input
              type="text"
              name="state"
              value={billing.state}
              onChange={handleBillingChange}
              placeholder="State"
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* ==================== SHIPPING DETAILS ==================== */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Shipping Details</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={sameAsBilling}
                onChange={handleSameAsBilling}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Same as billing address</span>
            </label>
          </div>

          {!sameAsBilling && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="first_name"
                  value={shipping.first_name}
                  onChange={handleShippingChange}
                  placeholder="First Name"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
                />
                <input
                  type="text"
                  name="last_name"
                  value={shipping.last_name}
                  onChange={handleShippingChange}
                  placeholder="Last Name"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
                />
              </div>

              <input
                type="text"
                name="address_1"
                value={shipping.address_1}
                onChange={handleShippingChange}
                placeholder="Street Address"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
              />

              <input
                type="text"
                name="address_2"
                value={shipping.address_2}
                onChange={handleShippingChange}
                placeholder="Apartment, suite, etc. (optional)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  name="city"
                  value={shipping.city}
                  onChange={handleShippingChange}
                  placeholder="City"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
                />
                <input
                  type="text"
                  name="postcode"
                  value={shipping.postcode}
                  onChange={handleShippingChange}
                  placeholder="Postcode / ZIP"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
                />
                <input
                  type="text"
                  name="state"
                  value={shipping.state}
                  onChange={handleShippingChange}
                  placeholder="State"
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 transition"
                />
              </div>
            </>
          )}

          {sameAsBilling && (
            <div className="p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-600">
              <p className="font-medium">Shipping address is the same as billing address</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Forms;