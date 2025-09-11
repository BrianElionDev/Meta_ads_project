"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAds, useAdStatusCounts } from "@/hooks/useAds";
import { useAuth } from "@/hooks/useAuth";
import { useApproveAd } from "@/hooks/useAds";
import { EnumAdStatus } from "@/types/user_ads";

export default function AdsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [filter, setFilter] = useState<
    "all" | "pending" | "ready" | "approved" | "posted" | "cancelled"
  >("all");

  // Use TanStack Query hooks
  const { data: ads = [], isLoading: loading } = useAds(filter);
  const statusCounts = useAdStatusCounts();
  const approveAdMutation = useApproveAd();

  const handleApprove = async (adId: string) => {
    try {
      await approveAdMutation.mutateAsync(adId);
    } catch (error) {
      console.error("Error approving ad:", error);
    }
  };

  const getStatusColor = (status: EnumAdStatus) => {
    switch (status) {
      case EnumAdStatus.posted:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case EnumAdStatus.approved:
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case EnumAdStatus.ready:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case EnumAdStatus.pending:
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case EnumAdStatus.cancelled:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: EnumAdStatus) => {
    switch (status) {
      case EnumAdStatus.posted:
        return "Posted";
      case EnumAdStatus.approved:
        return "Approved";
      case EnumAdStatus.ready:
        return "Ready";
      case EnumAdStatus.pending:
        return "Pending";
      case EnumAdStatus.cancelled:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
        <h1 className="text-3xl font-bold text-white mb-2">My Ads</h1>
        <p className="text-gray-400">
          Manage and monitor all your individual advertisements
        </p>
      </div>

      <div className="py-8 px-5 lg:px-10">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { key: "all", label: "All Ads", color: "gray", icon: "📊" },
            { key: "pending", label: "Pending", color: "yellow", icon: "⏳" },
            { key: "ready", label: "Ready", color: "blue", icon: "🎯" },
            { key: "approved", label: "Approved", color: "green", icon: "✅" },
            { key: "posted", label: "Posted", color: "purple", icon: "🚀" },
            { key: "cancelled", label: "Cancelled", color: "red", icon: "❌" },
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

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/create-campaign")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              + Create New Campaign
            </button>
          </div>
          <div className="text-gray-400">
            {ads.length} ad{ads.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Ads List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-400 mt-4">Loading ads...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No ads yet
            </h3>
            <p className="text-gray-400 mb-6">
              You haven&apos;t created any ads yet. Start building your first
              advertisement to reach your audience.
            </p>
            <button
              onClick={() => router.push("/create-campaign")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
            >
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/ads/${ad.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📱</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {ad.ad_name}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {ad.campaign_name} • {ad.adset_name}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          ad.status
                        )}`}
                      >
                        {getStatusLabel(ad.status)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white ml-2">
                          {formatDate(ad.created_at)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Status:</span>
                        <span className="text-white ml-2">
                          {getStatusLabel(ad.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/ads/${ad.id}`);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      View Details
                    </button>
                    {ad.status === EnumAdStatus.ready && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(ad.id);
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to Dashboard */}
      <div className="mt-8 px-5 lg:px-10">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}
