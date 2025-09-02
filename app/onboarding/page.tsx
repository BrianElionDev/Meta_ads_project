"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BusinessProfileDialog from "../../components/onboarding/BusinessProfileDialog";
import ConnectAdAccountDialog from "../../components/onboarding/ConnectAdAccountDialog";
import ReviewDetailsDialog from "../../components/onboarding/ReviewDetailsDialog";

interface OnboardingData {
  name: string;
  email: string;
  country: string;
  business: string;
  organization_email: string;
  ad_account_ID: string;
  page_ID: string;
  pixel_ID: string;
  instagram_ID: string;
  whatsapp_ID: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: "",
    email: "",
    country: "",
    business: "",
    organization_email: "",
    ad_account_ID: "",
    page_ID: "",
    pixel_ID: "",
    instagram_ID: "",
    whatsapp_ID: "",
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showBusinessDialog, setShowBusinessDialog] = useState(false);
  const [showAdAccountDialog, setShowAdAccountDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [isEditingBusiness, setIsEditingBusiness] = useState(false);
  const [isEditingAdAccount, setIsEditingAdAccount] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleBusinessProfileComplete = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setCompletedSteps((prev) => [...prev, 1]);
    setCurrentStep(2);
    setShowBusinessDialog(false);
    setIsEditingBusiness(false);
  };

  const handleAdAccountComplete = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setCompletedSteps((prev) => [...prev, 2]);
    setCurrentStep(3);
    setShowAdAccountDialog(false);
    setIsEditingAdAccount(false);
  };

  const handleReviewComplete = () => {
    setCompletedSteps((prev) => [...prev, 3]);
    setIsCompleted(true);
    setShowReviewDialog(false);
    handleSubmit();
  };

  const handleEditBusiness = () => {
    setShowReviewDialog(false);
    setIsEditingBusiness(true);
    setShowBusinessDialog(true);
  };

  const handleEditAdAccount = () => {
    setShowReviewDialog(false);
    setIsEditingAdAccount(true);
    setShowAdAccountDialog(true);
  };

  const handleBusinessProfileUpdate = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setShowBusinessDialog(false);
    setIsEditingBusiness(false);
    // Don't change completed steps or current step when editing
  };

  const handleAdAccountUpdate = (data: Partial<OnboardingData>) => {
    setOnboardingData((prev) => ({ ...prev, ...data }));
    setShowAdAccountDialog(false);
    setIsEditingAdAccount(false);
    // Don't change completed steps or current step when editing
  };

  const handleRestart = () => {
    setOnboardingData({
      name: "",
      email: "",
      country: "",
      business: "",
      organization_email: "",
      ad_account_ID: "",
      page_ID: "",
      pixel_ID: "",
      instagram_ID: "",
      whatsapp_ID: "",
    });
    setCompletedSteps([]);
    setCurrentStep(1);
    setIsCompleted(false);
    setIsEditingBusiness(false);
    setIsEditingAdAccount(false);
  };

  const handleSubmit = async () => {
    const response = await fetch("/api/onboarding", {
      method: "POST",
      body: JSON.stringify(onboardingData),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log(data);
  };

  const getStepStatus = (step: number) => {
    if (completedSteps.includes(step)) {
      return "completed";
    } else if (currentStep === step) {
      return "current";
    } else {
      return "pending";
    }
  };

  const getStepContent = (step: number) => {
    if (completedSteps.includes(step)) {
      switch (step) {
        case 1:
          return (
            <div className="space-y-2">
              <p className="text-blue-400 text-sm">✓ Completed</p>
              <p className="text-white text-sm">Name: {onboardingData.name}</p>
              <p className="text-white text-sm">
                Business: {onboardingData.business}
              </p>
              <p className="text-white text-sm">
                Country: {onboardingData.country}
              </p>
            </div>
          );
        case 2:
          return (
            <div className="space-y-2">
              <p className="text-blue-400 text-sm">✓ Completed</p>
              <p className="text-white text-sm">
                Ad Account ID: {onboardingData.ad_account_ID}
              </p>
              <p className="text-white text-sm">
                Organization Email: {onboardingData.organization_email}
              </p>
            </div>
          );
        default:
          return null;
      }
    }
    return null;
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Onboarding Complete! 🎉
          </h1>
          <p className="text-gray-400">
            You&apos;re all set up with Meta Ads Automation
          </p>
        </div>

        {/* Completed Steps Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Business Profile
            </h3>
            {getStepContent(1)}
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Ad Account Connected
            </h3>
            {getStepContent(2)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Back to Home
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Onboarding Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome to Meta Ads Automation
        </h1>
        <p className="text-gray-400">
          Let&apos;s get you set up with your first automated campaign
        </p>
      </div>

      {/* Onboarding Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Step 1: Business Profile */}
        <div
          className={`bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border ${
            getStepStatus(1) === "completed"
              ? "border-blue-500/50"
              : "border-gray-700/50"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getStepStatus(1) === "completed"
                  ? "bg-blue-600"
                  : "bg-blue-600/60"
              }`}
            >
              <span className="text-white font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Business Profile
            </h3>
          </div>

          {getStepContent(1) || (
            <>
              <p className="text-gray-300 mb-4">
                Set up your business information and preferences
              </p>
              <button
                onClick={() => setShowBusinessDialog(true)}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Configure Profile
              </button>
            </>
          )}
        </div>

        {/* Step 2: Connect Ad Account */}
        <div
          className={`bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border ${
            getStepStatus(2) === "completed"
              ? "border-blue-500/50"
              : "border-gray-700/50"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getStepStatus(2) === "completed"
                  ? "bg-blue-600"
                  : "bg-blue-600/60"
              }`}
            >
              <span className="text-white font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Connect Ad Account
            </h3>
          </div>

          {getStepContent(2) || (
            <>
              <p className="text-gray-300 mb-4">
                Connect your Facebook/Meta Ads account
              </p>
              <button
                onClick={() => setShowAdAccountDialog(true)}
                disabled={!completedSteps.includes(1)}
                className={`w-full px-4 py-3 rounded-lg transition-colors ${
                  completedSteps.includes(1)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Connect Account
              </button>
            </>
          )}
        </div>

        {/* Step 3: Review Details */}
        <div
          className={`bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border ${
            getStepStatus(3) === "completed"
              ? "border-blue-500/50"
              : "border-gray-700/50"
          }`}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                getStepStatus(3) === "completed"
                  ? "bg-blue-600"
                  : "bg-blue-600/60"
              }`}
            >
              <span className="text-white font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white">
              Review Your Details
            </h3>
          </div>

          {getStepContent(3) || (
            <>
              <p className="text-gray-300 mb-4">
                Review all provided information before proceeding
              </p>
              <button
                onClick={() => setShowReviewDialog(true)}
                disabled={!completedSteps.includes(2)}
                className={`w-full px-4 py-3 rounded-lg transition-colors ${
                  completedSteps.includes(2)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Review Details
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white font-medium">Setup Progress</span>
          <span className="text-gray-400">
            {completedSteps.length}/3 Complete
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedSteps.length / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Home
        </button>
        <button
          disabled={!isCompleted}
          onClick={() => router.push("/dashboard")}
          className={`px-6 py-3 rounded-lg transition-colors ${
            isCompleted
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Continue to Dashboard →
        </button>
      </div>

      {/* Dialogs */}
      <BusinessProfileDialog
        isOpen={showBusinessDialog}
        onClose={() => setShowBusinessDialog(false)}
        onComplete={handleBusinessProfileComplete}
        onUpdate={handleBusinessProfileUpdate}
        data={onboardingData}
        isEditing={isEditingBusiness}
      />

      <ConnectAdAccountDialog
        isOpen={showAdAccountDialog}
        onClose={() => setShowAdAccountDialog(false)}
        onComplete={handleAdAccountComplete}
        onUpdate={handleAdAccountUpdate}
        data={onboardingData}
        isEditing={isEditingAdAccount}
      />

      <ReviewDetailsDialog
        isOpen={showReviewDialog}
        onClose={() => setShowReviewDialog(false)}
        onComplete={handleReviewComplete}
        onRestart={handleRestart}
        onEditBusiness={handleEditBusiness}
        onEditAdAccount={handleEditAdAccount}
        data={onboardingData}
      />
    </div>
  );
}
