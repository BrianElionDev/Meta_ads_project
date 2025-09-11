import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");

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

    // Build the query to get unique campaigns with campaign-level data only
    let query = supabase
      .from("ads")
      .select(
        "campaign_ID, campaign_name, campaign_objective, status, created_at"
      )
      .eq("ad_account_ID", client.ad_account_ID)
      .not("campaign_ID", "is", null)
      .not("campaign_name", "is", null)
      .order("created_at", { ascending: false });

    // Add status filter if provided
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    // Add limit if provided
    if (limit) {
      query = query.limit(parseInt(limit));
    }

    const { data: ads, error } = await query;

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch campaigns" },
        { status: 500 }
      );
    }

    // Group by campaign_ID to get unique campaigns with campaign-level data only
    const campaignMap = new Map();

    ads?.forEach((ad) => {
      if (ad.campaign_ID && ad.campaign_name) {
        const campaignKey = ad.campaign_ID;
        if (!campaignMap.has(campaignKey)) {
          campaignMap.set(campaignKey, {
            id: ad.campaign_ID,
            name: ad.campaign_name,
            objective: ad.campaign_objective || "unknown",
            status: ad.status,
            created_at: ad.created_at,
            ad_count: 1,
          });
        } else {
          // Update status to the most advanced one and increment ad count
          const existing = campaignMap.get(campaignKey);
          existing.ad_count += 1;

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

    const campaigns = Array.from(campaignMap.values());

    return NextResponse.json({
      success: true,
      data: campaigns,
      message: "Campaigns fetched successfully",
    });
  } catch (error) {
    console.error("Fetch campaigns error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
