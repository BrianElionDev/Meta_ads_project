import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: campaignId } = await params;

    const supabase = await createServerClient();

    // Get the user ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", session.user.email)
      .single();

    if (userError || !user) {
      console.error("User not found:", userError);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the client's ad_account_ID for this user
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("ad_account_ID")
      .eq("user_id", user.id)
      .single();

    if (clientError || !client) {
      console.error("Client not found:", clientError);
      return NextResponse.json(
        { error: "Client not found. Please complete onboarding first." },
        { status: 404 }
      );
    }

    // Get all ads for this campaign
    const { data: ads, error } = await supabase
      .from("ads")
      .select("*")
      .eq("ad_account_ID", client.ad_account_ID)
      .eq("campaign_ID", campaignId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch campaign details" },
        { status: 500 }
      );
    }

    if (!ads || ads.length === 0) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Get campaign details from the first ad
    const firstAd = ads[0];
    const campaign = {
      id: campaignId,
      name: firstAd.campaign_name,
      objective: firstAd.campaign_objective || "unknown",
      status: firstAd.status,
      created_at: firstAd.created_at,
      ad_count: ads.length,
      adsets: [] as unknown[],
    };

    // Group ads by adset_ID to create adsets
    const adsetMap = new Map();

    ads.forEach((ad) => {
      if (ad.adset_ID && ad.adset_name) {
        const adsetKey = ad.adset_ID;
        if (!adsetMap.has(adsetKey)) {
          adsetMap.set(adsetKey, {
            id: ad.adset_ID,
            name: ad.adset_name,
            optimization_goal: ad.adset_optimization_goal || "REACH",
            status: ad.status,
            created_at: ad.created_at,
            ad_count: 1,
            ads: [
              {
                id: ad.id,
                name: ad.ad_name || "Untitled Ad",
                status: ad.status,
                created_at: ad.created_at,
              },
            ],
          });
        } else {
          // Update status to the most advanced one and increment ad count
          const existing = adsetMap.get(adsetKey);
          existing.ad_count += 1;
          existing.ads.push({
            id: ad.id,
            name: ad.ad_name || "Untitled Ad",
            status: ad.status,
            created_at: ad.created_at,
          });

          // Status priority: posted > approved > ready > pending
          const statusPriority = {
            posted: 4,
            approved: 3,
            ready: 2,
            pending: 1,
          };
          if (
            statusPriority[ad.status as keyof typeof statusPriority] >
            statusPriority[existing.status as keyof typeof statusPriority]
          ) {
            existing.status = ad.status;
          }
        }
      }
    });

    const adsets = Array.from(adsetMap.values());

    // Update campaign status to the most advanced one
    const statusPriority = {
      posted: 4,
      approved: 3,
      ready: 2,
      pending: 1,
    };

    let campaignStatus = campaign.status;
    ads.forEach((ad) => {
      if (
        statusPriority[ad.status as keyof typeof statusPriority] >
        statusPriority[campaignStatus as keyof typeof statusPriority]
      ) {
        campaignStatus = ad.status;
      }
    });

    campaign.status = campaignStatus;
    campaign.adsets = adsets;

    return NextResponse.json({
      success: true,
      data: campaign,
      message: "Campaign details fetched successfully",
    });
  } catch (error) {
    console.error("Fetch campaign details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
