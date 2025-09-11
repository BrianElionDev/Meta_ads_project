"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdSetFormData {
  name: string;
  description: string;
  targetAudience: string;
  targetCountries: string[];
  budget: string;
  startDate: string;
  endDate: string;
}

interface AdCreativeFormData {
  creationType: "new" | "reuse";
  name: string;
  description: string;
  headline: string;
  websiteUrl: string;
  adPostingPlatforms: string[];
  existingAdCreativeName?: string;
  existingAdCreativeId?: string;
}

const targetAudienceOptions = [
  "General audience",
  "Age-specific (18-24, 25-34, 35-44, 45-54, 55+)",
  "Gender-specific (Male, Female, All)",
  "Interest-based targeting",
  "Lookalike audience",
  "Custom audience",
];

const countryOptions = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "Japan",
  "Brazil",
  "India",
  "Mexico",
  "Italy",
  "Spain",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Switzerland",
  "Austria",
  "Belgium",
  "Ireland",
  "New Zealand",
  "Singapore",
  "South Korea",
];

const adPostingPlatforms = [
  "Facebook",
  "Instagram",
  "Messenger",
  "Audience Network",
  "WhatsApp",
];

export default function CreateAdSetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AdSetFormData>({
    name: "",
    description: "",
    targetAudience: "",
    targetCountries: [],
    budget: "",
    startDate: "",
    endDate: "",
  });

  const [adCreativeData, setAdCreativeData] = useState<AdCreativeFormData>({
    creationType: "new",
    name: "",
    description: "",
    headline: "",
    websiteUrl: "",
    adPostingPlatforms: [],
  });

  const [errors, setErrors] = useState<Partial<AdSetFormData>>({});
  const [adCreativeErrors, setAdCreativeErrors] = useState<
    Partial<AdCreativeFormData>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  const handleInputChange = (
    field: keyof AdSetFormData,
    value: string | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAdCreativeStringChange = (
    field:
      | "name"
      | "description"
      | "headline"
      | "websiteUrl"
      | "existingAdCreativeName"
      | "existingAdCreativeId",
    value: string
  ) => {
    setAdCreativeData((prev) => ({ ...prev, [field]: value }));
    if (adCreativeErrors[field]) {
      setAdCreativeErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAdCreativeTypeChange = (value: "new" | "reuse") => {
    setAdCreativeData((prev) => ({ ...prev, creationType: value }));
    if (adCreativeErrors.creationType) {
      setAdCreativeErrors((prev) => ({ ...prev, creationType: undefined }));
    }
  };

  const handleAdCreativeArrayChange = (
    field: "adPostingPlatforms",
    value: string[]
  ) => {
    setAdCreativeData((prev) => ({ ...prev, [field]: value }));
    if (adCreativeErrors[field]) {
      setAdCreativeErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountryToggle = (country: string) => {
    const currentCountries = [...formData.targetCountries];
    if (currentCountries.includes(country)) {
      const index = currentCountries.indexOf(country);
      currentCountries.splice(index, 1);
    } else {
      currentCountries.push(country);
    }
    handleInputChange("targetCountries", currentCountries);
  };

  const handlePlatformToggle = (platform: string) => {
    const currentPlatforms = [...adCreativeData.adPostingPlatforms];
    if (currentPlatforms.includes(platform)) {
      const index = currentPlatforms.indexOf(platform);
      currentPlatforms.splice(index, 1);
    } else {
      currentPlatforms.push(platform);
    }
    handleAdCreativeArrayChange("adPostingPlatforms", currentPlatforms);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<AdSetFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Ad set name is required";
    }

    if (!formData.targetAudience) {
      newErrors.targetAudience = "Please select a target audience";
    }

    if (formData.targetCountries.length === 0) {
      newErrors.targetCountries = "Please select at least one target country";
    }

    if (!formData.budget.trim()) {
      newErrors.budget = "Budget is required";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.startDate) >= new Date(formData.endDate)
    ) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAdCreativeForm = (): boolean => {
    const newErrors: Partial<AdCreativeFormData> = {};

    if (adCreativeData.creationType === "new") {
      if (!adCreativeData.name.trim()) {
        newErrors.name = "Ad creative name is required";
      }
    } else {
      if (!adCreativeData.existingAdCreativeName?.trim()) {
        newErrors.existingAdCreativeName =
          "Existing ad creative name is required";
      }
      if (!adCreativeData.existingAdCreativeId?.trim()) {
        newErrors.existingAdCreativeId = "Existing ad creative ID is required";
      }
    }

    if (!adCreativeData.description.trim()) {
      newErrors.description = "Ad description is required";
    }

    if (!adCreativeData.headline.trim()) {
      newErrors.headline = "Ad headline is required";
    }

    if (adCreativeData.adPostingPlatforms.length === 0) {
      newErrors.adPostingPlatforms =
        "Please select at least one ad posting platform";
    }

    setAdCreativeErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const preparePayload = () => {
    const payload = {
      campaign_creation: "new",
      new_ad_campaign_name: "", // This will come from campaign creation
      ad_campaign_objective: "", // This will come from campaign creation
      ad_set_name: formData.name,
      target_audience: formData.targetAudience,
      target_country_or_countries: formData.targetCountries.join(", "),
      budget_preference: "", // This will come from campaign creation
      campaign_budget: parseFloat(formData.budget) || 0,
      ad_posting_platform: adCreativeData.adPostingPlatforms.join(", "),
      ad_description: adCreativeData.description,
      ad_headline: adCreativeData.headline,
      campaign_duration: `${formData.startDate} to ${formData.endDate}`,
      website_url: adCreativeData.websiteUrl,
      additional_notes: formData.description,
      email: "", // This will need to be added from user context
      Advert_ready_media_id: null,
      Client_business_website_page: adCreativeData.websiteUrl,
      ad_set_creation: "new",
      existing_ad_campaign_name: null,
      ad_campaign_id: null,
      existing_ad_set_name: null,
      ad_set_id: null,
      ad_creative_creation: adCreativeData.creationType,
      existing_ad_creative_name:
        adCreativeData.creationType === "reuse"
          ? adCreativeData.existingAdCreativeName
          : null,
      ad_creative_id:
        adCreativeData.creationType === "reuse"
          ? adCreativeData.existingAdCreativeId
          : null,
      submitteded_media_file: null,
    };

    return payload;
  };

  const submitToWebhook = async (payload: Record<string, unknown>) => {
    try {
      const response = await fetch(
        "https://brianeliondev.app.n8n.cloud/webhook/d1ec865e-469a-4bf9-ab33-2a9442474892",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Webhook response:", result);
      return true;
    } catch (error) {
      console.error("Error submitting to webhook:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm() && validateAdCreativeForm()) {
      setShowReviewDialog(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = preparePayload();
      console.log("Submitting payload:", payload);

      const success = await submitToWebhook(payload);

      if (success) {
        alert("Ad set and ad creative created successfully!");
        setShowReviewDialog(false);
        router.push("/dashboard");
      } else {
        alert("Failed to submit data. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Ad Set</h1>
        <p className="text-gray-400">
          Set up your ad set with targeting, budget, and ad creative details
        </p>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Ad Set Details */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Ad Set Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Ad Set Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-600/50"
                  }`}
                  placeholder="Provide a name for your ad set"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Target Audience Type *
                </label>
                <div className="space-y-3">
                  {targetAudienceOptions.map((option) => (
                    <label
                      key={option}
                      className="flex items-start space-x-3 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="targetAudience"
                        value={option}
                        checked={formData.targetAudience === option}
                        onChange={(e) =>
                          handleInputChange("targetAudience", e.target.value)
                        }
                        className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.targetAudience && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.targetAudience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Target Countries *
                </label>
                <p className="text-gray-400 text-sm mb-3">
                  Select the countries where you want your ads to appear
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto">
                  {countryOptions.map((country) => (
                    <label
                      key={country}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.targetCountries.includes(country)}
                        onChange={() => handleCountryToggle(country)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">{country}</span>
                    </label>
                  ))}
                </div>
                {errors.targetCountries && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.targetCountries}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Budget and Duration */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Budget & Duration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Daily Budget *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-white text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      handleInputChange("budget", e.target.value)
                    }
                    min="0"
                    step="0.01"
                    className={`w-full pl-8 pr-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.budget ? "border-red-500" : "border-gray-600/50"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.budget && (
                  <p className="text-red-400 text-sm mt-1">{errors.budget}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.startDate ? "border-red-500" : "border-gray-600/50"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      handleInputChange("endDate", e.target.value)
                    }
                    min={
                      formData.startDate ||
                      new Date().toISOString().split("T")[0]
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white rounded-lg border focus:outline-none focus:border-blue-500 ${
                      errors.endDate ? "border-red-500" : "border-gray-600/50"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ad Creative Section */}
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Ad Creative
            </h3>
            <div className="space-y-6">
              {/* Creation Type Selection */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Ad Creative Creation *
                </label>
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="creationType"
                      value="new"
                      checked={adCreativeData.creationType === "new"}
                      onChange={(e) =>
                        handleAdCreativeTypeChange(
                          e.target.value as "new" | "reuse"
                        )
                      }
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="text-white text-sm">
                      Create New Ad Creative
                    </span>
                  </label>
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="creationType"
                      value="reuse"
                      checked={adCreativeData.creationType === "reuse"}
                      onChange={(e) =>
                        handleAdCreativeTypeChange(
                          e.target.value as "new" | "reuse"
                        )
                      }
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500"
                    />
                    <span className="text-white text-sm">
                      Reuse Existing Ad Creative
                    </span>
                  </label>
                </div>
              </div>

              {/* New Ad Creative Fields */}
              {adCreativeData.creationType === "new" && (
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Provide the name of the AD Creative *
                  </label>
                  <input
                    type="text"
                    value={adCreativeData.name}
                    onChange={(e) =>
                      handleAdCreativeStringChange("name", e.target.value)
                    }
                    className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                      adCreativeErrors.name
                        ? "border-red-500"
                        : "border-gray-600/50"
                    }`}
                    placeholder="Enter a name for your ad creative"
                  />
                  {adCreativeErrors.name && (
                    <p className="text-red-400 text-sm mt-1">
                      {adCreativeErrors.name}
                    </p>
                  )}
                </div>
              )}

              {/* Existing Ad Creative Fields */}
              {adCreativeData.creationType === "reuse" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Provide the name of the existing AD Creative *
                    </label>
                    <input
                      type="text"
                      value={adCreativeData.existingAdCreativeName || ""}
                      onChange={(e) =>
                        handleAdCreativeStringChange(
                          "existingAdCreativeName",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                        adCreativeErrors.existingAdCreativeName
                          ? "border-red-500"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Enter the name of existing ad creative"
                    />
                    {adCreativeErrors.existingAdCreativeName && (
                      <p className="text-red-400 text-sm mt-1">
                        {adCreativeErrors.existingAdCreativeName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Provide the ID of the existing AD Creative *
                    </label>
                    <input
                      type="text"
                      value={adCreativeData.existingAdCreativeId || ""}
                      onChange={(e) =>
                        handleAdCreativeStringChange(
                          "existingAdCreativeId",
                          e.target.value
                        )
                      }
                      className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                        adCreativeErrors.existingAdCreativeId
                          ? "border-red-500"
                          : "border-gray-600/50"
                      }`}
                      placeholder="Enter the ID of existing ad creative"
                    />
                    {adCreativeErrors.existingAdCreativeId && (
                      <p className="text-red-400 text-sm mt-1">
                        {adCreativeErrors.existingAdCreativeId}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Common Ad Creative Fields */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Provide a description of your Ad that would capture your
                  audience&apos;s attention *
                </label>
                <textarea
                  value={adCreativeData.description}
                  onChange={(e) =>
                    handleAdCreativeStringChange("description", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                    adCreativeErrors.description
                      ? "border-red-500"
                      : "border-gray-600/50"
                  }`}
                  placeholder="Write compelling ad copy that will engage your target audience"
                />
                {adCreativeErrors.description && (
                  <p className="text-red-400 text-sm mt-1">
                    {adCreativeErrors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Provide a suitable headline for your description above *
                </label>
                <input
                  type="text"
                  value={adCreativeData.headline}
                  onChange={(e) =>
                    handleAdCreativeStringChange("headline", e.target.value)
                  }
                  className={`w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border focus:outline-none focus:border-blue-500 ${
                    adCreativeErrors.headline
                      ? "border-red-500"
                      : "border-gray-600/50"
                  }`}
                  placeholder="Enter a catchy headline for your ad"
                />
                {adCreativeErrors.headline && (
                  <p className="text-red-400 text-sm mt-1">
                    {adCreativeErrors.headline}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Provide your website or landing page URL if any
                </label>
                <input
                  type="url"
                  value={adCreativeData.websiteUrl}
                  onChange={(e) =>
                    handleAdCreativeStringChange("websiteUrl", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-gray-700/50 text-white placeholder-gray-400 rounded-lg border border-gray-600/50 focus:outline-none focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Select your desired Ad posting platform(s) *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {adPostingPlatforms.map((platform) => (
                    <label
                      key={platform}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={adCreativeData.adPostingPlatforms.includes(
                          platform
                        )}
                        onChange={() => handlePlatformToggle(platform)}
                        className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-white text-sm">{platform}</span>
                    </label>
                  ))}
                </div>
                {adCreativeErrors.adPostingPlatforms && (
                  <p className="text-red-400 text-sm mt-1">
                    {adCreativeErrors.adPostingPlatforms}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={() => router.push("/create-campaign")}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back to Campaign
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Review & Create Ad Creative
            </button>
          </div>
        </form>
      </div>

      {/* Review Dialog */}
      {showReviewDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-4xl w-full mx-4 border border-gray-700/50 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Review Your Ad Campaign
              </h2>
              <button
                onClick={() => setShowReviewDialog(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Campaign Section */}
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Campaign Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Campaign Name:</span>
                    <p className="text-white">
                      [Campaign name will be filled from campaign creation]
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Campaign Objective:</span>
                    <p className="text-white">
                      [Campaign objective will be filled from campaign creation]
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Budget Preference:</span>
                    <p className="text-white">
                      [Budget preference will be filled from campaign creation]
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Weekly Budget:</span>
                    <p className="text-white">
                      [Weekly budget will be filled from campaign creation]
                    </p>
                  </div>
                </div>
              </div>

              {/* Ad Set Section */}
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ad Set Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Ad Set Name:</span>
                    <p className="text-white">{formData.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Target Audience:</span>
                    <p className="text-white">{formData.targetAudience}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Target Countries:</span>
                    <p className="text-white">
                      {formData.targetCountries.join(", ")}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Daily Budget:</span>
                    <p className="text-white">${formData.budget}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Start Date:</span>
                    <p className="text-white">{formData.startDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">End Date:</span>
                    <p className="text-white">{formData.endDate}</p>
                  </div>
                </div>
              </div>

              {/* Ad Creative Section */}
              <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Ad Creative Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Creation Type:</span>
                    <p className="text-white capitalize">
                      {adCreativeData.creationType}
                    </p>
                  </div>
                  {adCreativeData.creationType === "new" ? (
                    <div>
                      <span className="text-gray-400">Ad Creative Name:</span>
                      <p className="text-white">{adCreativeData.name}</p>
                    </div>
                  ) : (
                    <>
                      <div>
                        <span className="text-gray-400">
                          Existing Ad Creative Name:
                        </span>
                        <p className="text-white">
                          {adCreativeData.existingAdCreativeName}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-400">
                          Existing Ad Creative ID:
                        </span>
                        <p className="text-white">
                          {adCreativeData.existingAdCreativeId}
                        </p>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-gray-400">Ad Description:</span>
                    <p className="text-white">{adCreativeData.description}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ad Headline:</span>
                    <p className="text-white">{adCreativeData.headline}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Website URL:</span>
                    <p className="text-white">
                      {adCreativeData.websiteUrl || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-400">Ad Posting Platforms:</span>
                    <p className="text-white">
                      {adCreativeData.adPostingPlatforms.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={() => setShowReviewDialog(false)}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Edit Details
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-lg transition-colors ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Ad Creative"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
