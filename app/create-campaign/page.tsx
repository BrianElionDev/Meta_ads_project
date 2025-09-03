"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CampaignFormData {
  name: string;
  objective: string;
  description: string;
  startDate: string;
  endDate: string;
  budgetPreference: string;
  weeklyBudget?: string;
  websiteLink?: string;
  appId?: string;
  pageId?: string;
}

const campaignObjectives = [
  {
    value: "awareness",
    label: "Make more people aware of my brand or product.",
    type: "Awareness",
    requiresAdditional: false
  },
  {
    value: "traffic",
    label: "Get more people to visit my website",
    type: "Traffic",
    requiresAdditional: true,
    additionalField: "websiteLink",
    placeholder: "Enter your website's link"
  },
  {
    value: "engagement",
    label: "Get more people to engage with my videos or content and/or more likes and comments.",
    type: "Engagement",
    requiresAdditional: true,
    additionalField: "pageId",
    placeholder: "Enter your Facebook Page ID",
    description: "Please provide the Facebook Page ID where you want to increase engagement"
  },
  {
    value: "leads",
    label: "Collect contact information from potential customers.",
    type: "Leads",
    requiresAdditional: false
  },
  {
    value: "app_promotion",
    label: "Increase app installations and usage",
    type: "App promotion",
    requiresAdditional: true,
    additionalField: "appId",
    placeholder: "Enter your app ID",
    description: "Please provide the app ID for the app which you would like to be installed by your customers"
  },
  {
    value: "sales",
    label: "Generate actual sales/purchases directly from the ads.",
    type: "Sales",
    requiresAdditional: false
  }
];

const budgetOptions = [
  {
    value: "predictable",
    label: "Predictable - I want to know exactly how much I spend"
  },
  {
    value: "flexible",
    label: "Flexible - Let my spending be optimized based on analytics"
  }
];

export default function CreateCampaignPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CampaignFormData>({
    name: "",
    objective: "",
    description: "",
    startDate: "",
    endDate: "",
    budgetPreference: "",
    weeklyBudget: "",
    websiteLink: "",
    appId: "",
    pageId: ""
  });

  const [errors, setErrors] = useState<Partial<CampaignFormData>>({});
  const [showAdSetDialog, setShowAdSetDialog] = useState(false);

  const handleInputChange = (field: keyof CampaignFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<CampaignFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Campaign name is required";
    }

    if (!formData.objective) {
      newErrors.objective = "Please select a campaign objective";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Campaign description is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (!formData.budgetPreference) {
      newErrors.budgetPreference = "Please select a budget preference";
    }

    if (formData.budgetPreference === "predictable" && !formData.weeklyBudget?.trim()) {
      newErrors.weeklyBudget = "Weekly budget is required for predictable budget preference";
    }

    // Validate additional fields based on objective
    const selectedObjective = campaignObjectives.find(obj => obj.value === formData.objective);
    if (selectedObjective?.requiresAdditional) {
      const additionalField = selectedObjective.additionalField as keyof CampaignFormData;
      if (!formData[additionalField]?.trim()) {
        newErrors[additionalField] = `This field is required for ${selectedObjective.type} campaigns`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowAdSetDialog(true);
    }
  };

  const handleCreateNewAdSet = () => {
    setShowAdSetDialog(false);
    router.push("/create-ad-set");
  };

  const handleReuseAdSet = () => {
    setShowAdSetDialog(false);
    // TODO: Implement reuse existing ad set functionality
    console.log("Reuse existing ad set");
  };

  const selectedObjective = campaignObjectives.find(obj => obj.value === formData.objective);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create New Campaign</h1>
        <p className="text-gray-400">Set up your advertising campaign with the details below</p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campaign Name */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="Provide a name for your new Ad Campaign"
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Campaign Objective *
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Please ensure you select the most appropriate campaign objective. It will determine the campaign optimization for better performance.
                </p>
                <div className="space-y-3">
                  {campaignObjectives.map((objective) => (
                    <label key={objective.value} className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="objective"
                        value={objective.value}
                        checked={formData.objective === objective.value}
                        onChange={(e) => handleInputChange('objective', e.target.value)}
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <span className="text-white text-sm">{objective.label}</span>
                        <span className="text-blue-400 text-sm ml-2">({objective.type})</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.objective && <p className="text-red-400 text-sm mt-1">{errors.objective}</p>}
              </div>

              {/* Additional fields based on objective */}
              {selectedObjective?.requiresAdditional && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {selectedObjective.type === "Traffic" ? "Website Link" : 
                     selectedObjective.type === "App promotion" ? "App ID" : 
                     selectedObjective.type === "Engagement" ? "Page ID" : "Additional Field"} *
                  </label>
                  {selectedObjective.description && (
                    <p className="text-gray-400 text-sm mb-3">
                      {selectedObjective.description}
                    </p>
                  )}
                  <input
                    type="text"
                    value={formData[selectedObjective.additionalField as keyof CampaignFormData] || ""}
                    onChange={(e) => handleInputChange(selectedObjective.additionalField as keyof CampaignFormData, e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors[selectedObjective.additionalField as keyof CampaignFormData] ? 'border-red-500' : 'border-gray-600/50'
                    }`}
                    placeholder={selectedObjective.placeholder}
                  />
                  {errors[selectedObjective.additionalField as keyof CampaignFormData] && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors[selectedObjective.additionalField as keyof CampaignFormData]}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Campaign Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                  placeholder="Briefly describe what this new campaign is about"
                />
                {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
              </div>
            </div>
          </div>

          {/* Campaign Duration */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Campaign Duration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border focus:outline-none focus:border-blue-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                />
                {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border focus:outline-none focus:border-blue-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-600/50'
                  }`}
                />
                {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Budget Preference */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Budget Preference</h3>
            <p className="text-gray-400 text-sm mb-4">
              A flexible budget is preferred for better optimization strategies on Meta
            </p>
            <div className="space-y-3">
              {budgetOptions.map((option) => (
                <label key={option.value} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="budgetPreference"
                    value={option.value}
                    checked={formData.budgetPreference === option.value}
                    onChange={(e) => handleInputChange('budgetPreference', e.target.value)}
                    className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                  />
                  <span className="text-white text-sm">{option.label}</span>
                </label>
              ))}
            </div>
            {errors.budgetPreference && <p className="text-red-400 text-sm mt-1">{errors.budgetPreference}</p>}
          </div>

          {/* Weekly Budget Section for Predictable Selection */}
          {formData.budgetPreference === "predictable" && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-4">Weekly Budget</h3>
              <p className="text-gray-400 text-sm mb-4">
                Ensure it is accurate since it will never be exceeded.
              </p>
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Specify your EXACT weekly budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-white text-lg">$</span>
                  <input
                    type="number"
                    value={formData.weeklyBudget}
                    onChange={(e) => handleInputChange('weeklyBudget', e.target.value)}
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.weeklyBudget ? 'border-red-500' : 'border-gray-600/50'
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.weeklyBudget && <p className="text-red-400 text-sm mt-1">{errors.weeklyBudget}</p>}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Dashboard
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Proceed to Ad Set Creation
            </button>
          </div>
        </form>
      </div>

      {/* Ad Set Creation Dialog */}
      {showAdSetDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl w-full mx-4 border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Create Ad Set</h2>
              <button
                onClick={() => setShowAdSetDialog(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div 
                className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={handleCreateNewAdSet}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                    <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Create New Ad Set</h3>
                    <p className="text-gray-300 text-sm">
                      Start from scratch with a completely new ad set tailored to your campaign
                    </p>
                  </div>
                </div>
              </div>

              <div 
                className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={handleReuseAdSet}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30">
                    <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057A1 1 0 015.999 9H1a1 1 0 010-2h4.999a1 1 0 011 1v2.101a7.002 7.002 0 0111.601-2.566 1 1 0 111.885.666A5.002 5.002 0 0014.001 13H11a1 1 0 010-2h4a1 1 0 011 1v1a1 1 0 01-1 1h-4.001z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">Reuse Existing Ad Set</h3>
                    <p className="text-gray-300 text-sm">
                      Use a previously created ad set as a template for this campaign
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
