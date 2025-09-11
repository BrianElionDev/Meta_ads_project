"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useApproveAd } from "@/hooks/useAds";
import { EnumAdStatus } from "@/types/user_ads";

interface AdDetail {
  id: string;
  name: string;
  status: EnumAdStatus;
  created_at: string;
  campaign_name: string;
  adset_name: string;
  ad_description?: string;
  ad_headline?: string;
  website_url?: string;
  email?: string;
  facebook_image_url?: string;
  image_url?: string;
  campaign_ID?: string;
  adset_ID?: string;
  ad_creative_ID?: string;
  ad_ID?: string;
  n8n_workflow_id?: string;
}

export default function AdDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [ad, setAd] = useState<AdDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const approveAdMutation = useApproveAd();

  const adId = params?.id as string;

  const fetchAdDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ads/${adId}`);
      const data = await response.json();

      if (data.success) {
        setAd(data.data);
      } else {
        setError(data.error || "Failed to fetch ad details");
      }
    } catch (err) {
      setError("Error loading ad details");
      console.error("Error fetching ad details:", err);
    } finally {
      setLoading(false);
    }
  }, [adId]);

  useEffect(() => {
    if (adId) {
      fetchAdDetails();
    }
  }, [adId, fetchAdDetails]);

  const handleApprove = async () => {
    if (!ad) return;

    try {
      await approveAdMutation.mutateAsync(ad.id);
      // Refresh the ad details after approval
      fetchAdDetails();
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
            You need to be signed in to view ad details.
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
          <p className="text-gray-400">Loading ad details...</p>
        </div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Ad Not Found</h1>
          <p className="text-gray-400 mb-6">
            {error || "The ad you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/ads")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Ads
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
                onClick={() => router.push("/ads")}
                className="text-gray-400 hover:text-white transition-colors mb-4"
              >
                ← Back to Ads
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">{ad.name}</h1>
              <p className="text-gray-400">Ad ID: {ad.id}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  ad.status
                )}`}
              >
                {getStatusLabel(ad.status)}
              </span>
              {ad.status === EnumAdStatus.ready && (
                <button
                  onClick={handleApprove}
                  disabled={approveAdMutation.isPending}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {approveAdMutation.isPending ? "Approving..." : "Approve Ad"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ad Overview */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Ad Overview</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Campaign
                  </h3>
                  <p className="text-white">{ad.campaign_name}</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Ad Set
                  </h3>
                  <p className="text-white">{ad.adset_name}</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Created
                  </h3>
                  <p className="text-white">{formatDate(ad.created_at)}</p>
                </div>
                <div className="bg-gray-700/30 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-2">
                    Status
                  </h3>
                  <p className="text-white">{getStatusLabel(ad.status)}</p>
                </div>
              </div>
            </div>

            {/* Ad Content */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
              <h2 className="text-xl font-bold text-white mb-6">Ad Content</h2>

              <div className="space-y-6">
                {ad.ad_headline && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                      Headline
                    </h3>
                    <p className="text-white text-lg">{ad.ad_headline}</p>
                  </div>
                )}

                {ad.ad_description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                      Description
                    </h3>
                    <p className="text-white">{ad.ad_description}</p>
                  </div>
                )}

                {ad.website_url && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                      Website URL
                    </h3>
                    <a
                      href={ad.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {ad.website_url}
                    </a>
                  </div>
                )}

                {ad.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                      Email
                    </h3>
                    <p className="text-white">{ad.email}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Images */}
            {(ad.facebook_image_url || ad.image_url) && (
              <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
                <h2 className="text-xl font-bold text-white mb-6">Ad Images</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ad.facebook_image_url && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        Facebook Image
                      </h3>
                      <img
                        src={ad.facebook_image_url}
                        alt="Facebook ad image"
                        className="w-full rounded-lg border border-gray-600/50 hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  )}

                  {ad.image_url && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-3">
                        Ad Image
                      </h3>
                      <img
                        src={ad.image_url}
                        alt="Ad image"
                        className="w-full rounded-lg border border-gray-600/50 hover:scale-105 transition-all duration-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/campaigns/${ad.campaign_ID}`)}
                  className="w-full px-4 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors border border-blue-500/30"
                >
                  View Campaign
                </button>
                <button
                  onClick={() => router.push(`/adsets/${ad.adset_ID}`)}
                  className="w-full px-4 py-3 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors border border-green-500/30"
                >
                  View Ad Set
                </button>
                {ad.status === EnumAdStatus.ready && (
                  <button
                    onClick={handleApprove}
                    disabled={approveAdMutation.isPending}
                    className="w-full px-4 py-3 bg-emerald-600/20 text-emerald-400 rounded-lg hover:bg-emerald-600/30 transition-colors border border-emerald-500/30 disabled:opacity-50"
                  >
                    {approveAdMutation.isPending
                      ? "Approving..."
                      : "Approve Ad"}
                  </button>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Technical Details
              </h3>

              <div className="space-y-3 text-sm">
                {ad.campaign_ID && (
                  <div>
                    <span className="text-gray-400">Campaign ID:</span>
                    <p className="text-white font-mono">{ad.campaign_ID}</p>
                  </div>
                )}
                {ad.adset_ID && (
                  <div>
                    <span className="text-gray-400">Ad Set ID:</span>
                    <p className="text-white font-mono">{ad.adset_ID}</p>
                  </div>
                )}
                {ad.ad_creative_ID && (
                  <div>
                    <span className="text-gray-400">Ad Creative ID:</span>
                    <p className="text-white font-mono">{ad.ad_creative_ID}</p>
                  </div>
                )}
                {ad.ad_ID && (
                  <div>
                    <span className="text-gray-400">Ad ID:</span>
                    <p className="text-white font-mono">{ad.ad_ID}</p>
                  </div>
                )}
                {ad.n8n_workflow_id && (
                  <div>
                    <span className="text-gray-400">Workflow ID:</span>
                    <p className="text-white font-mono">{ad.n8n_workflow_id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
