"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AdCampaign } from "@/types/adCreation";

export default function CreateCampaignPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<AdCampaign>>({
    campaign_creation: "new",
    new_ad_campaign_name: "",
    ad_campaign_objective: "",
    ad_set_name: "",
    target_audience: "",
    target_country_or_countries: "",
    budget_preference: "",
    campaign_budget: null,
    ad_posting_platform: "",
    ad_description: "",
    ad_headline: "",
    campaign_duration: "",
    website_url: "",
    additional_notes: "",
    email: "",
    Advert_ready_media_id: null,
    Client_business_website_page: "",
    ad_set_creation: "new",
    existing_ad_campaign_name: null,
    ad_campaign_id: null,
    existing_ad_set_name: null,
    ad_set_id: null,
    ad_creative_creation: "new",
    existing_ad_creative_name: null,
    ad_creative_id: null,
    submitteded_media_file: null,
  });

  const [errors, setErrors] = useState<{ [K in keyof AdCampaign]?: string }>(
    {}
  );

  const handleInputChange = (
    field: keyof AdCampaign,
    value: string | number | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: { [K in keyof AdCampaign]?: string } = {};

    if (step === 1) {
      if (!formData.new_ad_campaign_name?.trim()) {
        newErrors.new_ad_campaign_name = "Campaign name is required";
      }
      if (!formData.ad_campaign_objective) {
        newErrors.ad_campaign_objective = "Campaign objective is required";
      }
      if (!formData.ad_description?.trim()) {
        newErrors.ad_description = "Campaign description is required";
      }
      if (!formData.campaign_duration?.trim()) {
        newErrors.campaign_duration = "Campaign duration is required";
      }
      if (!formData.budget_preference) {
        newErrors.budget_preference = "Budget preference is required";
      }
      if (
        formData.budget_preference === "predictable" &&
        !formData.campaign_budget
      ) {
        newErrors.campaign_budget =
          "Campaign budget is required for predictable budget";
      }
    }

    if (step === 2) {
      if (!formData.ad_set_name?.trim()) {
        newErrors.ad_set_name = "Ad set name is required";
      }
      if (!formData.target_audience?.trim()) {
        newErrors.target_audience = "Target audience is required";
      }
      if (!formData.target_country_or_countries?.trim()) {
        newErrors.target_country_or_countries = "Target countries are required";
      }
      if (!formData.ad_posting_platform) {
        newErrors.ad_posting_platform = "Ad posting platform is required";
      }
    }

    if (step === 3) {
      if (!formData.ad_headline?.trim()) {
        newErrors.ad_headline = "Ad headline is required";
      }
      if (!formData.ad_description?.trim()) {
        newErrors.ad_description = "Ad description is required";
      }
      if (!formData.website_url?.trim()) {
        newErrors.website_url = "Website URL is required";
      }
      if (!formData.email?.trim()) {
        newErrors.email = "Email is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/create_ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Campaign created successfully!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "Failed to create campaign"}`);
      }
    } catch (error) {
      alert("Error creating campaign. Please try again.");
      console.error("Error creating campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const campaignObjectives = [
    { value: "awareness", label: "Brand Awareness" },
    { value: "traffic", label: "Traffic" },
    { value: "engagement", label: "Engagement" },
    { value: "leads", label: "Lead Generation" },
    { value: "app_promotion", label: "App Promotion" },
    { value: "sales", label: "Sales" },
  ];

  const platforms = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "messenger", label: "Messenger" },
    { value: "audience_network", label: "Audience Network" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Campaign</h1>
        <p className="text-gray-400">Complete campaign setup in 3 steps</p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-16">
          <span
            className={`text-sm ${
              currentStep === 1 ? "text-blue-400" : "text-gray-500"
            }`}
          >
            Campaign
          </span>
          <span
            className={`text-sm ${
              currentStep === 2 ? "text-blue-400" : "text-gray-500"
            }`}
          >
            Ad Set
          </span>
          <span
            className={`text-sm ${
              currentStep === 3 ? "text-blue-400" : "text-gray-500"
            }`}
          >
            Ad Creative
          </span>
        </div>

        {/* Debug info */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">Current Step: {currentStep}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Campaign Details */}
          {currentStep === 1 && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">
                Campaign Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Campaign Name *
                  </label>
                  <input
                    type="text"
                    value={formData.new_ad_campaign_name || ""}
                    onChange={(e) =>
                      handleInputChange("new_ad_campaign_name", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.new_ad_campaign_name
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="Enter campaign name"
                  />
                  {errors.new_ad_campaign_name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.new_ad_campaign_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Campaign Objective *
                  </label>
                  <select
                    value={formData.ad_campaign_objective || ""}
                    onChange={(e) =>
                      handleInputChange("ad_campaign_objective", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.ad_campaign_objective
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                  >
                    <option value="">Select objective</option>
                    {campaignObjectives.map((obj) => (
                      <option key={obj.value} value={obj.value}>
                        {obj.label}
                      </option>
                    ))}
                  </select>
                  {errors.ad_campaign_objective && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ad_campaign_objective}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Campaign Description *
                  </label>
                  <textarea
                    value={formData.ad_description || ""}
                    onChange={(e) =>
                      handleInputChange("ad_description", e.target.value)
                    }
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.ad_description
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="Describe your campaign"
                  />
                  {errors.ad_description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ad_description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Campaign Duration *
                  </label>
                  <input
                    type="text"
                    value={formData.campaign_duration || ""}
                    onChange={(e) =>
                      handleInputChange("campaign_duration", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.campaign_duration
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="e.g., 30 days, 2 weeks"
                  />
                  {errors.campaign_duration && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.campaign_duration}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Budget Preference *
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="budget_preference"
                        value="predictable"
                        checked={formData.budget_preference === "predictable"}
                        onChange={(e) =>
                          handleInputChange("budget_preference", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">
                        Predictable - Fixed budget
                      </span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="budget_preference"
                        value="flexible"
                        checked={formData.budget_preference === "flexible"}
                        onChange={(e) =>
                          handleInputChange("budget_preference", e.target.value)
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">
                        Flexible - Optimized spending
                      </span>
                    </label>
                  </div>
                  {errors.budget_preference && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.budget_preference}
                    </p>
                  )}
                </div>

                {formData.budget_preference === "predictable" && (
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Campaign Budget ($) *
                    </label>
                    <input
                      type="number"
                      value={formData.campaign_budget || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "campaign_budget",
                          parseFloat(e.target.value)
                        )
                      }
                      min="0"
                      step="0.01"
                      className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                        errors.campaign_budget
                          ? "border-red-500"
                          : "border-gray-600/50"
                      }`}
                      placeholder="0.00"
                    />
                    {errors.campaign_budget && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.campaign_budget}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Ad Set Details */}
          {currentStep === 2 && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">
                Ad Set Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ad Set Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ad_set_name || ""}
                    onChange={(e) =>
                      handleInputChange("ad_set_name", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.ad_set_name
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="Enter ad set name"
                  />
                  {errors.ad_set_name && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ad_set_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    value={formData.target_audience || ""}
                    onChange={(e) =>
                      handleInputChange("target_audience", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.target_audience
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="e.g., Young professionals, 25-35, interested in tech"
                  />
                  {errors.target_audience && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.target_audience}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Target Countries *
                  </label>
                  <input
                    type="text"
                    value={formData.target_country_or_countries || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "target_country_or_countries",
                        e.target.value
                      )
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.target_country_or_countries
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="e.g., United States, Canada, United Kingdom"
                  />
                  {errors.target_country_or_countries && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.target_country_or_countries}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ad Posting Platform *
                  </label>
                  <select
                    value={formData.ad_posting_platform || ""}
                    onChange={(e) =>
                      handleInputChange("ad_posting_platform", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.ad_posting_platform
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                  >
                    <option value="">Select platform</option>
                    {platforms.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                  {errors.ad_posting_platform && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ad_posting_platform}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Ad Creative Details */}
          {currentStep === 3 && (
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-semibold text-white mb-6">
                Ad Creative Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ad Headline *
                  </label>
                  <input
                    type="text"
                    value={formData.ad_headline || ""}
                    onChange={(e) =>
                      handleInputChange("ad_headline", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.ad_headline
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="Enter compelling ad headline"
                  />
                  {errors.ad_headline && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ad_headline}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Ad Description *
                  </label>
                  <textarea
                    value={formData.ad_description || ""}
                    onChange={(e) =>
                      handleInputChange("ad_description", e.target.value)
                    }
                    rows={4}
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.ad_description
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="Describe your ad content"
                  />
                  {errors.ad_description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.ad_description}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    value={formData.website_url || ""}
                    onChange={(e) =>
                      handleInputChange("website_url", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.website_url
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="https://yourwebsite.com"
                  />
                  {errors.website_url && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.website_url}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Business Website Page
                  </label>
                  <input
                    type="text"
                    value={formData.Client_business_website_page || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "Client_business_website_page",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., /products, /services"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.additional_notes || ""}
                    onChange={(e) =>
                      handleInputChange("additional_notes", e.target.value)
                    }
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
                    placeholder="Any additional information or special requirements"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.email ? "border-red-500" : "border-gray-600/50"
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Dashboard
            </button>

            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
