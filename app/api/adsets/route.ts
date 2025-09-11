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

    // Build the query to get unique adsets with adset-level data only
    let query = supabase
      .from("ads")
      .select(
        "adset_ID, adset_name, adset_optimization_goal, campaign_ID, campaign_name, status, created_at"
      )
      .eq("ad_account_ID", client.ad_account_ID)
      .not("adset_ID", "is", null)
      .not("adset_name", "is", null)
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
        { error: "Failed to fetch adsets" },
        { status: 500 }
      );
    }

    // Group by adset_ID to get unique adsets with adset-level data only
    const adsetMap = new Map();

    ads?.forEach((ad) => {
      if (ad.adset_ID && ad.adset_name) {
        const adsetKey = ad.adset_ID;
        if (!adsetMap.has(adsetKey)) {
          adsetMap.set(adsetKey, {
            id: ad.adset_ID,
            name: ad.adset_name,
            optimization_goal: ad.adset_optimization_goal || "REACH",
            campaign_id: ad.campaign_ID,
            campaign_name: ad.campaign_name,
            status: ad.status,
            created_at: ad.created_at,
            ad_count: 1,
          });
        } else {
          // Update status to the most advanced one and increment ad count
          const existing = adsetMap.get(adsetKey);
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

    const adsets = Array.from(adsetMap.values());

    return NextResponse.json({
      success: true,
      data: adsets,
      message: "Adsets fetched successfully",
    });
  } catch (error) {
    console.error("Fetch adsets error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
