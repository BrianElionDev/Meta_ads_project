"use client";

import React, { useState } from "react";

interface AdAccountData {
  organization_email: string;
  ad_account_ID: string;
  page_ID: string;
  pixel_ID: string;
  instagram_ID: string;
  whatsapp_ID: string;
}

interface ConnectAdAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: AdAccountData) => void;
  onUpdate?: (data: AdAccountData) => void;
  data: Partial<AdAccountData>;
  isEditing?: boolean;
}

export default function ConnectAdAccountDialog({
  isOpen,
  onClose,
  onComplete,
  onUpdate,
  data,
  isEditing = false
}: ConnectAdAccountDialogProps) {
  const [formData, setFormData] = useState<AdAccountData>({
    organization_email: data.organization_email || "",
    ad_account_ID: data.ad_account_ID || "",
    page_ID: data.page_ID || "",
    pixel_ID: data.pixel_ID || "",
    instagram_ID: data.instagram_ID || "",
    whatsapp_ID: data.whatsapp_ID || "",
  });

  // Update form data when data prop changes (for editing)
  React.useEffect(() => {
    setFormData({
      organization_email: data.organization_email || "",
      ad_account_ID: data.ad_account_ID || "",
      page_ID: data.page_ID || "",
      pixel_ID: data.pixel_ID || "",
      instagram_ID: data.instagram_ID || "",
      whatsapp_ID: data.whatsapp_ID || "",
    });
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.organization_email && formData.ad_account_ID) {
      if (isEditing && onUpdate) {
        onUpdate(formData);
      } else {
        onComplete(formData);
      }
    }
  };

  const handleChange = (field: keyof AdAccountData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 border border-gray-700/50 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Connect Ad Account</h2>
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
              Organization Email *
            </label>
            <input
              type="email"
              value={formData.organization_email}
              onChange={(e) => handleChange('organization_email', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter organization email"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Ad Account ID *
            </label>
            <input
              type="text"
              value={formData.ad_account_ID}
              onChange={(e) => handleChange('ad_account_ID', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter Facebook Ad Account ID"
              required
            />
            <p className="text-gray-400 text-xs mt-1">Found in Facebook Ads Manager</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Page ID
            </label>
            <input
              type="text"
              value={formData.page_ID}
              onChange={(e) => handleChange('page_ID', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter Facebook Page ID (optional)"
            />
            <p className="text-gray-400 text-xs mt-1">Found in Page Settings</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Pixel ID
            </label>
            <input
              type="text"
              value={formData.pixel_ID}
              onChange={(e) => handleChange('pixel_ID', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter Facebook Pixel ID (optional)"
            />
            <p className="text-gray-400 text-xs mt-1">Found in Events Manager</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Instagram ID
            </label>
            <input
              type="text"
              value={formData.instagram_ID}
              onChange={(e) => handleChange('instagram_ID', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter Instagram Business ID (optional)"
            />
            <p className="text-gray-400 text-xs mt-1">Found in Instagram Business Settings</p>
          </div>

          <div>
            <label className="block text-white text-sm font-medium mb-2">
              WhatsApp ID
            </label>
            <input
              type="text"
              value={formData.whatsapp_ID}
              onChange={(e) => handleChange('whatsapp_ID', e.target.value)}
              className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
              placeholder="Enter WhatsApp Business ID (optional)"
            />
            <p className="text-gray-400 text-xs mt-1">Found in WhatsApp Business Manager</p>
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
