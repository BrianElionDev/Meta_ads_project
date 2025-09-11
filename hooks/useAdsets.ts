"use client";

import { useQuery } from "@tanstack/react-query";

export interface Adset {
  id: string;
  name: string;
  optimization_goal: string;
  campaign_id: string;
  campaign_name: string;
  status: "pending" | "ready" | "approved" | "posted" | "cancelled";
  created_at: string;
  ad_count: number;
}

// Fetch all adsets
export const useAdsets = (filter?: string) => {
  return useQuery({
    queryKey: ["adsets", filter],
    queryFn: async (): Promise<Adset[]> => {
      const response = await fetch(
        `/api/adsets${filter && filter !== "all" ? `?status=${filter}` : ""}`
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch adsets");
      }
      return data.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });
};

// Get adset status counts
export const useAdsetStatusCounts = () => {
  const { data: adsets = [] } = useAdsets();

  return {
    all: adsets.length,
    pending: adsets.filter((adset) => adset.status === "pending").length,
    ready: adsets.filter((adset) => adset.status === "ready").length,
    approved: adsets.filter((adset) => adset.status === "approved").length,
    posted: adsets.filter((adset) => adset.status === "posted").length,
    cancelled: adsets.filter((adset) => adset.status === "cancelled").length,
  };
};
