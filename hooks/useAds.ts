"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserAds } from "@/types/user_ads";

// Fetch all ads
export const useAds = (filter?: string) => {
  return useQuery({
    queryKey: ["ads", filter],
    queryFn: async (): Promise<UserAds[]> => {
      const response = await fetch(
        `/api/ads${filter && filter !== "all" ? `?status=${filter}` : ""}`
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch ads");
      }
      return data.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });
};

// Fetch single ad
export const useAd = (id: string) => {
  return useQuery({
    queryKey: ["ad", id],
    queryFn: async (): Promise<UserAds> => {
      const response = await fetch(`/api/ads/${id}`);
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch ad");
      }
      return data.data;
    },
    enabled: !!id,
    staleTime: 30000,
  });
};

// Approve ad mutation
export const useApproveAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adId: string) => {
      const response = await fetch("/api/update-ad-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ad_id: adId,
          status: "approved",
          step: "approval",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve ad");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch ads queries
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });
};

// Create ad mutation
export const useCreateAd = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (adData: Record<string, unknown>) => {
      const response = await fetch("/api/create_ad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adData),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to create ad");
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch ads queries
      queryClient.invalidateQueries({ queryKey: ["ads"] });
    },
  });
};

// Get status counts
export const useAdStatusCounts = () => {
  const { data: ads = [] } = useAds();

  return {
    all: ads.length,
    pending: ads.filter((ad) => ad.status === "pending").length,
    ready: ads.filter((ad) => ad.status === "ready").length,
    approved: ads.filter((ad) => ad.status === "approved").length,
    posted: ads.filter((ad) => ad.status === "posted").length,
  };
};
