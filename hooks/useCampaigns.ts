"use client";

import { useQuery } from "@tanstack/react-query";

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: "pending" | "ready" | "approved" | "posted" | "cancelled";
  created_at: string;
  ad_count: number;
}

// Fetch all campaigns
export const useCampaigns = (filter?: string) => {
  return useQuery({
    queryKey: ["campaigns", filter],
    queryFn: async (): Promise<Campaign[]> => {
      const response = await fetch(
        `/api/campaigns${filter && filter !== "all" ? `?status=${filter}` : ""}`
      );
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch campaigns");
      }
      return data.data;
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // Refetch every minute for real-time updates
  });
};

// Get campaign status counts
export const useCampaignStatusCounts = () => {
  const { data: campaigns = [] } = useCampaigns();

  return {
    all: campaigns.length,
    pending: campaigns.filter((campaign) => campaign.status === "pending")
      .length,
    ready: campaigns.filter((campaign) => campaign.status === "ready").length,
    approved: campaigns.filter((campaign) => campaign.status === "approved")
      .length,
    posted: campaigns.filter((campaign) => campaign.status === "posted").length,
    cancelled: campaigns.filter((campaign) => campaign.status === "cancelled")
      .length,
  };
};
