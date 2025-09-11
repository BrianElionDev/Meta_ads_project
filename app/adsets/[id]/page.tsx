"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface AdsetDetail {
  id: string;
  name: string;
  optimization_goal: string;
  campaign_id: string;
  campaign_name: string;
  status: "pending" | "ready" | "approved" | "posted" | "cancelled";
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

export default function AdsetDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  const [adset, setAdset] = useState<AdsetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adsetId = params?.id as string;

  useEffect(() => {
    if (adsetId) {
      fetchAdsetDetails();
    }
  }, [adsetId, fetchAdsetDetails]);

  const fetchAdsetDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/adsets/${adsetId}`);
      const data = await response.json();

      if (data.success) {
        setAdset(data.data);
      } else {
        setError(data.error || "Failed to fetch adset details");
      }
    } catch (err) {
      setError("Error loading adset details");
      console.error("Error fetching adset details:", err);
    } finally {
      setLoading(false);
    }
  }, [adsetId]);

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
            You need to be signed in to view adset details.
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
          <p className="text-gray-400">Loading adset details...</p>
        </div>
      </div>
    );
  }

  if (error || !adset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Adset Not Found
          </h1>
          <p className="text-gray-400 mb-6">
            {error || "The adset you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/adsets")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Adsets
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
                onClick={() => router.push("/adsets")}
                className="text-gray-400 hover:text-white transition-colors mb-4"
              >
                ← Back to Adsets
              </button>
              <h1 className="text-3xl font-bold text-white mb-2">
                {adset.name}
              </h1>
              <p className="text-gray-400">Adset ID: {adset.id}</p>
            </div>
            <div className="text-right">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                  adset.status
                )}`}
              >
                {getStatusLabel(adset.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Adset Overview */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Adset Overview</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Campaign
              </h3>
              <p className="text-white">{adset.campaign_name}</p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Optimization Goal
              </h3>
              <p className="text-white capitalize">
                {adset.optimization_goal.replace("_", " ")}
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Created
              </h3>
              <p className="text-white">{formatDate(adset.created_at)}</p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Total Ads
              </h3>
              <p className="text-white text-2xl font-bold">{adset.ad_count}</p>
            </div>
          </div>
        </div>

        {/* Ads */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Ads ({adset.ads?.length || 0})
            </h2>
            <button
              onClick={() => router.push("/create-campaign")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              + Add Ad
            </button>
          </div>

          {adset.ads && adset.ads.length > 0 ? (
            <div className="space-y-4">
              {adset.ads.map((ad) => (
                <div
                  key={ad.id}
                  className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50 hover:border-blue-500/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/ads/${ad.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">📱</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {ad.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          Created: {formatDate(ad.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          ad.status
                        )}`}
                      >
                        {getStatusLabel(ad.status)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/ads/${ad.id}`);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
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
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No ads yet
              </h3>
              <p className="text-gray-400 mb-4">
                This adset doesn&apos;t have any ads yet.
              </p>
              <button
                onClick={() => router.push("/create-campaign")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Ad
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
