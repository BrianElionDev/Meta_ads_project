"use client";

import { useState, useEffect } from "react";
import { UserAds, EnumAdStatus } from "@/types/user_ads";

interface AdTrackingCardProps {
  ad: UserAds;
  onRefresh?: () => void;
  onApprove?: (adId: string) => void;
}

const stepOrder = [
  { key: "content_creation", label: "Content Creation", icon: "📝" },
  { key: "campaign_creation", label: "Campaign Creation", icon: "🎯" },
  { key: "adset_creation", label: "Ad Set Creation", icon: "📊" },
  { key: "adcreative_creation", label: "Ad Creative Creation", icon: "🎨" },
  { key: "approval", label: "Approval", icon: "✅" },
  { key: "ad_posting", label: "Ad Posting", icon: "🚀" },
];

export default function AdTrackingCard({
  ad,
  onRefresh,
  onApprove,
}: AdTrackingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTimeAgo = () => {
      const now = new Date();
      const created = new Date(ad.created_at);
      const diffMs = now.getTime() - created.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        setTimeAgo(`${diffDays}d ago`);
      } else if (diffHours > 0) {
        setTimeAgo(`${diffHours}h ago`);
      } else {
        setTimeAgo(`${diffMins}m ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000);
    return () => clearInterval(interval);
  }, [ad.created_at]);

  const getStepStatus = (stepKey: string) => {
    const timestampField = `${stepKey}_completed_at`;
    const hasTimestamp = ad[timestampField as keyof UserAds];

    if (hasTimestamp) return "completed";
    if (ad.status === EnumAdStatus.cancelled) return "cancelled";
    if (ad.error_message) return "error";

    // Check if this step should be in progress
    const stepIndex = stepOrder.findIndex((s) => s.key === stepKey);
    const prevStep = stepOrder[stepIndex - 1];
    const prevStepCompleted = prevStep
      ? ad[`${prevStep.key}_completed_at` as keyof UserAds]
      : true;

    if (prevStepCompleted && !hasTimestamp) return "in_progress";
    return "pending";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      case "in_progress":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "error":
        return "text-red-400 bg-red-400/10 border-red-400/30";
      case "cancelled":
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getAdStatusColor = (status: EnumAdStatus) => {
    switch (status) {
      case EnumAdStatus.pending:
        return "text-amber-400 bg-amber-400/10 border-amber-400/30";
      case EnumAdStatus.ready:
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case EnumAdStatus.approved:
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/30";
      case EnumAdStatus.posted:
        return "text-purple-400 bg-purple-400/10 border-purple-400/30";
      case EnumAdStatus.cancelled:
        return "text-gray-400 bg-gray-400/10 border-gray-400/30";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30";
    }
  };

  const getOverallProgress = () => {
    // If status is posted, it's 100% complete regardless of other fields
    if (ad.status === EnumAdStatus.posted) return 100;

    // If status is approved, it's 100% complete (ready to post)
    if (ad.status === EnumAdStatus.approved) return 100;

    // If we have ad_ID, it's 100% complete
    if (ad.ad_ID) return 100;

    // If status is ready, check what we have
    if (ad.status === EnumAdStatus.ready) {
      // If we have ad_creative_ID, we're at 83% (5/6 steps)
      if (ad.ad_creative_ID) return 83;
      // If we have adset_ID, we're at 67% (4/6 steps)
      if (ad.adset_ID) return 67;
      // If we have campaign_ID, we're at 50% (3/6 steps)
      if (ad.campaign_ID) return 50;
      // If we have image_url, we're at 17% (1/6 steps)
      if (ad.image_url) return 17;
    }

    // For pending status, check what fields we have
    if (ad.status === EnumAdStatus.pending) {
      // If we have ad_creative_ID, we're at 83% (5/6 steps)
      if (ad.ad_creative_ID) return 83;
      // If we have adset_ID, we're at 67% (4/6 steps)
      if (ad.adset_ID) return 67;
      // If we have campaign_ID, we're at 50% (3/6 steps)
      if (ad.campaign_ID) return 50;
      // If we have image_url, we're at 17% (1/6 steps)
      if (ad.image_url) return 17;
    }

    // Default to 0% if nothing is available
    return 0;
  };

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return null;
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">📱</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">
                  {ad.campaign_name || "Untitled Campaign"}
                </h3>
                <p className="text-sm text-gray-400">
                  {ad.ad_name || "Ad Creative"}
                </p>
              </div>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getAdStatusColor(
                  ad.status
                )}`}
              >
                {ad.status.toString().toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Created {timeAgo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                <span>{getOverallProgress()}% Complete</span>
              </div>
              {ad.n8n_workflow_id && (
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>ID: {ad.n8n_workflow_id.slice(0, 8)}...</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {ad.status === EnumAdStatus.ready && onApprove && (
              <button
                onClick={() => onApprove(ad.id)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
              >
                Approve
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 text-gray-400 hover:text-white transition-colors bg-gray-700/50 rounded-lg hover:bg-gray-600/50"
            >
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm font-bold text-white">
              {getOverallProgress()}%
            </span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getOverallProgress()}%` }}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6 pt-4 border-t border-gray-700/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Campaign Details
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Objective:</span>
                    <span className="text-white font-medium capitalize">
                      {ad.campaign_objective?.replace("_", " ") || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ad Set:</span>
                    <span className="text-white font-medium">
                      {ad.adset_name || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ad Name:</span>
                    <span className="text-white font-medium">
                      {ad.ad_name || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                  <span className="mr-2">🎨</span>
                  Ad Creative
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hook:</span>
                    <span className="text-white font-medium">
                      {ad.hook || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">CTA:</span>
                    <span className="text-white font-medium">
                      {ad.cta_text || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Message:</span>
                    <span className="text-white font-medium truncate max-w-32">
                      {ad.message || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                <span className="mr-2">⚡</span>
                Automation Progress
              </h4>
              <div className="space-y-4">
                {stepOrder.map((step) => {
                  const stepStatus = getStepStatus(step.key);
                  const timestamp = ad[
                    `${step.key}_completed_at` as keyof UserAds
                  ] as string;

                  return (
                    <div key={step.key} className="flex items-center space-x-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border-2 ${getStatusColor(
                          stepStatus
                        )}`}
                      >
                        {stepStatus === "completed" ? "✓" : step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-medium ${
                              stepStatus === "completed"
                                ? "text-emerald-400"
                                : stepStatus === "in_progress"
                                ? "text-blue-400"
                                : stepStatus === "error"
                                ? "text-red-400"
                                : "text-gray-400"
                            }`}
                          >
                            {step.label}
                          </span>
                          {timestamp && (
                            <span className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded">
                              {formatTimestamp(timestamp)}
                            </span>
                          )}
                        </div>
                        {stepStatus === "error" && ad.error_message && (
                          <div className="text-xs text-red-400 mt-2 bg-red-400/10 p-2 rounded border border-red-400/20">
                            ⚠️ Error: {ad.error_message}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {ad.facebook_image_url && ad.facebook_image_url !== "pending" && (
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                  <span className="mr-2">🖼️</span>
                  Ad Preview
                </h4>
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <img
                    src={ad.facebook_image_url}
                    alt="Ad preview"
                    className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700/50">
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  className="px-4 py-2 text-sm bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  🔄 Refresh
                </button>
              )}
              {ad.status === EnumAdStatus.posted && (
                <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  👁️ View Ad
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
