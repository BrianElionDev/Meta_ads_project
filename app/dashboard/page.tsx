"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateCampaignDialog from "../../components/dashboard/CreateCampaignDialog";
import AdsTable from "../../components/dashboard/AdsTable";
import { useAuth } from "@/hooks/useAuth";
import { useAds, useApproveAd, useAdStatusCounts } from "@/hooks/useAds";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showCreateCampaignDialog, setShowCreateCampaignDialog] =
    useState(false);
  const [filter, setFilter] = useState<
    "all" | "pending" | "ready" | "approved" | "posted"
  >("all");

  // Use TanStack Query hooks
  const { data: ads = [], isLoading: loading } = useAds(filter);
  const approveAdMutation = useApproveAd();
  const statusCounts = useAdStatusCounts();

  const handleApprove = async (adId: string) => {
    try {
      await approveAdMutation.mutateAsync(adId);
    } catch (error) {
      console.error("Error approving ad:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Please sign in</h1>
          <p className="text-gray-400">
            You need to be signed in to view your ads.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="mb-8 px-5 lg:px-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Manage your advertising campaigns and track automation progress
            </p>
          </div>
          <button
            onClick={() => setShowCreateCampaignDialog(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Create Campaign
          </button>
        </div>
      </div>

      <div className="py-8 px-5 lg:px-10">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { key: "all", label: "All Ads", color: "gray", icon: "📊" },
            { key: "pending", label: "Pending", color: "yellow", icon: "⏳" },
            { key: "ready", label: "Ready", color: "blue", icon: "🎯" },
            { key: "approved", label: "Approved", color: "green", icon: "✅" },
            { key: "posted", label: "Posted", color: "purple", icon: "🚀" },
          ].map(({ key, label, color, icon }) => (
            <div
              key={key}
              onClick={() => setFilter(key as typeof filter)}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                filter === key
                  ? `bg-${color}-600/20 border-${color}-500/50 text-${color}-400`
                  : "bg-gray-800/60 border-gray-700/50 text-gray-400 hover:border-gray-600/50"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <div className="text-2xl font-bold">
                    {statusCounts[key as keyof typeof statusCounts]}
                  </div>
                  <div className="text-sm font-medium">{label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-pointer"
            onClick={() => router.push("/campaigns")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">My Campaigns</p>
                <p className="text-gray-600 text-sm">
                  Manage and monitor all your advertising campaigns
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-green-500/50 transition-colors cursor-pointer"
            onClick={() => router.push("/adsets")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">My Adsets</p>
                <p className="text-gray-600 text-sm">
                  Manage and monitor all your advertising sets
                </p>
              </div>
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-orange-500/50 transition-colors cursor-pointer"
            onClick={() => router.push("/ads")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-200 text-sm">My Ads</p>
                <p className="text-gray-600 text-sm">
                  Manage and monitor all your individual advertisements
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-colors cursor-pointer"
            onClick={() => setShowCreateCampaignDialog(true)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">
                  Create Campaign
                </p>
                <p className="text-gray-300 text-sm">
                  Start building your complete advertising campaign
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Ads Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No ads found
            </h3>
            <p className="text-gray-400 mb-6">
              Create your first campaign to get started with ad automation
            </p>
            <button
              onClick={() => setShowCreateCampaignDialog(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <AdsTable ads={ads} onApprove={handleApprove} />
        )}
      </div>

      {/* Create Campaign Dialog */}
      <CreateCampaignDialog
        isOpen={showCreateCampaignDialog}
        onClose={() => setShowCreateCampaignDialog(false)}
      />
    </div>
  );
}
