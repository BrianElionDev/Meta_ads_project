"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface CampaignDetail {
  id: string;
  name: string;
  objective: string;
  status: "pending" | "ready" | "approved" | "posted" | "cancelled";
  created_at: string;
  ad_count: number;
  adsets: AdsetDetail[];
}

interface AdsetDetail {
  id: string;
  name: string;
  optimization_goal: string;
  status: string;
  created_at: string;
  ad_count: number;
  ads: AdDetail[];
}

interface AdDetail {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const campaignId = params?.id as string;

  const fetchCampaignDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/campaigns/${campaignId}`);
      const data = await response.json();

      if (data.success) {
        setCampaign(data.data);
      } else {
        setError(data.error || "Failed to fetch campaign details");
      }
    } catch (err) {
      setError("Error loading campaign details");
      console.error("Error fetching campaign details:", err);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      fetchCampaignDetails();
    }
  }, [campaignId, fetchCampaignDetails]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "ready":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "posted":
        return "Posted";
      case "approved":
        return "Approved";
      case "ready":
        return "Ready";
      case "pending":
        return "Pending";
      case "cancelled":
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
      hour: "2-digit",
      minute: "2-digit",
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
            You need to be signed in to view campaign details.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Campaign Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            {error || "The campaign you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/campaigns")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push("/campaigns")}
                className="text-gray-400 hover:text-white transition-colors mb-4"
              >
                ← Back to Campaigns
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">
                {campaign.name}
              </h1>
              <p className="text-gray-400">Campaign ID: {campaign.id}</p>
            </div>
            <div className="text-right">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  campaign.status
                )}`}
              >
                {getStatusLabel(campaign.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Campaign Overview */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">
            Campaign Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Objective
              </h3>
              <p className="text-white capitalize">
                {campaign.objective.replace("_", " ")}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Created
              </h3>
              <p className="text-white">{formatDate(campaign.created_at)}</p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Total Ads
              </h3>
              <p className="text-white text-2xl font-bold">
                {campaign.ad_count}
              </p>
            </div>
          </div>
        </div>

        {/* Adsets */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Adsets ({campaign.adsets?.length || 0})
            </h2>
            <button
              onClick={() => router.push("/create-campaign")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Add Adset
            </button>
          </div>

          {campaign.adsets && campaign.adsets.length > 0 ? (
            <div className="space-y-4">
              {campaign.adsets.map((adset) => (
                <div
                  key={adset.id}
                  className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {adset.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {adset.optimization_goal} • {adset.ad_count} ads
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        adset.status
                      )}`}
                    >
                      {getStatusLabel(adset.status)}
                    </span>
                  </div>

                  {/* Ads in this adset */}
                  {adset.ads && adset.ads.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-400 mb-3">
                        Ads in this adset:
                      </h4>
                      <div className="space-y-2">
                        {adset.ads.map((ad) => (
                          <div
                            key={ad.id}
                            className="flex items-center justify-between bg-gray-600/30 rounded-lg p-3"
                          >
                            <div>
                              <p className="text-white text-sm">{ad.name}</p>
                              <p className="text-gray-400 text-xs">
                                Created: {formatDate(ad.created_at)}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                                ad.status
                              )}`}
                            >
                              {getStatusLabel(ad.status)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-700/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No adsets yet
              </h3>
              <p className="text-gray-400 mb-4">
                This campaign doesn&apos;t have any adsets yet.
              </p>
              <button
                onClick={() => router.push("/create-campaign")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Adset
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
