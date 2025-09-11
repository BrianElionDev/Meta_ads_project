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

  const steps = [
    {
      number: 1,
      title: "Campaign",
      description: "Set up your campaign basics",
      icon: "🎯",
    },
    {
      number: 2,
      title: "Ad Set",
      description: "Define targeting and budget",
      icon: "🎪",
    },
    {
      number: 3,
      title: "Ad Creative",
      description: "Create your ad content",
      icon: "✨",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Create Campaign
              </h1>
              <p className="text-gray-400">
                Build your complete advertising campaign in 3 simple steps
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors border border-gray-600/50"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                      currentStep >= step.number
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                        : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.icon}
                  </div>
                  <div className="mt-3 text-center">
                    <div
                      className={`text-sm font-semibold ${
                        currentStep >= step.number
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </div>
                    <div
                      className={`text-xs ${
                        currentStep >= step.number
                          ? "text-gray-300"
                          : "text-gray-500"
                      }`}
                    >
                      {step.description}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 rounded-full transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-blue-500 to-purple-600"
                        : "bg-gray-700/50"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Campaign Details */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Campaign Setup
                  </h2>
                  <p className="text-gray-400">
                    Define your campaign goals and basic information
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Campaign Name *
                    </label>
                    <input
                      type="text"
                      value={formData.new_ad_campaign_name || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "new_ad_campaign_name",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.new_ad_campaign_name
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Enter a compelling campaign name"
                    />
                    {errors.new_ad_campaign_name && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.new_ad_campaign_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Campaign Objective *
                    </label>
                    <select
                      value={formData.ad_campaign_objective || ""}
                      onChange={(e) =>
                        handleInputChange(
                          "ad_campaign_objective",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.ad_campaign_objective
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                    >
                      <option value="">Select your campaign goal</option>
                      {campaignObjectives.map((obj) => (
                        <option key={obj.value} value={obj.value}>
                          {obj.label}
                        </option>
                      ))}
                    </select>
                    {errors.ad_campaign_objective && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.ad_campaign_objective}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Campaign Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.campaign_duration || ""}
                      onChange={(e) =>
                        handleInputChange("campaign_duration", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.campaign_duration
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="e.g., 30 days, 2 weeks"
                    />
                    {errors.campaign_duration && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.campaign_duration}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Campaign Description *
                    </label>
                    <textarea
                      value={formData.ad_description || ""}
                      onChange={(e) =>
                        handleInputChange("ad_description", e.target.value)
                      }
                      rows={4}
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                        errors.ad_description
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Describe your campaign goals and what you want to achieve"
                    />
                    {errors.ad_description && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.ad_description}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Budget Preference *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="budget_preference"
                          value="predictable"
                          checked={formData.budget_preference === "predictable"}
                          onChange={(e) =>
                            handleInputChange(
                              "budget_preference",
                              e.target.value
                            )
                          }
                          className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <div className="ml-4">
                          <div className="text-white font-medium">
                            Predictable Budget
                          </div>
                          <div className="text-gray-400 text-sm">
                            Fixed daily or total budget
                          </div>
                        </div>
                      </label>
                      <label className="flex items-center p-4 bg-gray-700/30 rounded-xl border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                        <input
                          type="radio"
                          name="budget_preference"
                          value="flexible"
                          checked={formData.budget_preference === "flexible"}
                          onChange={(e) =>
                            handleInputChange(
                              "budget_preference",
                              e.target.value
                            )
                          }
                          className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                        />
                        <div className="ml-4">
                          <div className="text-white font-medium">
                            Flexible Budget
                          </div>
                          <div className="text-gray-400 text-sm">
                            Optimized spending based on performance
                          </div>
                        </div>
                      </label>
                    </div>
                    {errors.budget_preference && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.budget_preference}
                      </p>
                    )}
                  </div>

                  {formData.budget_preference === "predictable" && (
                    <div className="md:col-span-2">
                      <label className="block text-white text-sm font-medium mb-3">
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
                        className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                          errors.campaign_budget
                            ? "border-red-500/50"
                            : "border-gray-600/50"
                        }`}
                        placeholder="0.00"
                      />
                      {errors.campaign_budget && (
                        <p className="text-red-400 text-sm mt-2">
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
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Ad Set Configuration
                  </h2>
                  <p className="text-gray-400">
                    Define your target audience and placement settings
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Ad Set Name *
                    </label>
                    <input
                      type="text"
                      value={formData.ad_set_name || ""}
                      onChange={(e) =>
                        handleInputChange("ad_set_name", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.ad_set_name
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Enter a descriptive ad set name"
                    />
                    {errors.ad_set_name && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.ad_set_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Target Audience *
                    </label>
                    <input
                      type="text"
                      value={formData.target_audience || ""}
                      onChange={(e) =>
                        handleInputChange("target_audience", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.target_audience
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="e.g., Young professionals, 25-35, interested in tech"
                    />
                    {errors.target_audience && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.target_audience}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
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
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.target_country_or_countries
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="e.g., United States, Canada, United Kingdom"
                    />
                    {errors.target_country_or_countries && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.target_country_or_countries}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Ad Posting Platform *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {platforms.map((platform) => (
                        <label
                          key={platform.value}
                          className={`flex items-center p-4 rounded-xl border transition-colors cursor-pointer ${
                            formData.ad_posting_platform === platform.value
                              ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                              : "bg-gray-700/30 border-gray-600/50 text-gray-300 hover:border-gray-500/50"
                          }`}
                        >
                          <input
                            type="radio"
                            name="ad_posting_platform"
                            value={platform.value}
                            checked={
                              formData.ad_posting_platform === platform.value
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "ad_posting_platform",
                                e.target.value
                              )
                            }
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm font-medium">
                            {platform.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.ad_posting_platform && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.ad_posting_platform}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Ad Creative Details */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Ad Creative
                  </h2>
                  <p className="text-gray-400">
                    Create compelling ad content that converts
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Ad Headline *
                    </label>
                    <input
                      type="text"
                      value={formData.ad_headline || ""}
                      onChange={(e) =>
                        handleInputChange("ad_headline", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.ad_headline
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Enter a compelling ad headline that grabs attention"
                    />
                    {errors.ad_headline && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.ad_headline}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-3">
                      Ad Description *
                    </label>
                    <textarea
                      value={formData.ad_description || ""}
                      onChange={(e) =>
                        handleInputChange("ad_description", e.target.value)
                      }
                      rows={4}
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none ${
                        errors.ad_description
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Write engaging ad copy that explains your offer and encourages action"
                    />
                    {errors.ad_description && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.ad_description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Website URL *
                    </label>
                    <input
                      type="url"
                      value={formData.website_url || ""}
                      onChange={(e) =>
                        handleInputChange("website_url", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.website_url
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="https://yourwebsite.com"
                    />
                    {errors.website_url && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.website_url}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
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
                      className="w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="e.g., /products, /services"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email || ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className={`w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                        errors.email
                          ? "border-red-500/50"
                          : "border-gray-600/50"
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-2">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-3">
                      Additional Notes
                    </label>
                    <textarea
                      value={formData.additional_notes || ""}
                      onChange={(e) =>
                        handleInputChange("additional_notes", e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-4 bg-gray-700/50 text-white placeholder-gray-400 rounded-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                      placeholder="Any additional information or special requirements"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-700/50">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-colors border border-gray-600/50"
              >
                Cancel
              </button>

              <div className="flex space-x-4">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-600/50 text-white rounded-xl hover:bg-gray-500/50 transition-colors border border-gray-600/50"
                  >
                    ← Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating Campaign...
                      </span>
                    ) : (
                      "🚀 Create Campaign"
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
