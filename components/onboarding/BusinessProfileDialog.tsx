"use client";

import React, { useState } from "react";

interface BusinessProfileData {
  name: string;
  email: string;
  country: string;
  business: string;
}

interface BusinessProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: BusinessProfileData) => void;
  onUpdate?: (data: BusinessProfileData) => void;
  data: Partial<BusinessProfileData>;
  isEditing?: boolean;
}

export default function BusinessProfileDialog({
  isOpen,
  onClose,
  onComplete,
  onUpdate,
  data,
  isEditing = false
}: BusinessProfileDialogProps) {
  const [formData, setFormData] = useState<BusinessProfileData>({
    name: data.name || "",
    email: data.email || "",
    country: data.country || "",
    business: data.business || "",
  });

  // Update form data when data prop changes (for editing)
  React.useEffect(() => {
    setFormData({
      name: data.name || "",
      email: data.email || "",
      country: data.country || "",
      business: data.business || "",
    });
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.country && formData.business) {
      if (isEditing && onUpdate) {
        onUpdate(formData);
      } else {
        onComplete(formData);
      }
    }
  };

  const handleChange = (field: keyof BusinessProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Business Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Business Name *
            </label>
            <input
              type="text"
              value={formData.business}
              onChange={(e) => handleChange('business', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter your business name"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Country *
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Select a country</option>
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="India">India</option>
              <option value="Brazil">Brazil</option>
              <option value="Mexico">Mexico</option>
              <option value="South Africa">South Africa</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="Ghana">Ghana</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Update' : 'Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
