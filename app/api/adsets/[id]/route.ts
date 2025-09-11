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

    const { id: adsetId } = await params;

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

    // Get all ads for this adset
    const { data: ads, error } = await supabase
      .from("ads")
      .select("*")
      .eq("ad_account_ID", client.ad_account_ID)
      .eq("adset_ID", adsetId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch adset details" },
        { status: 500 }
      );
    }

    if (!ads || ads.length === 0) {
      return NextResponse.json({ error: "Adset not found" }, { status: 404 });
    }

    // Get adset details from the first ad
    const firstAd = ads[0];
    const adset = {
      id: adsetId,
      name: firstAd.adset_name,
      optimization_goal: firstAd.adset_optimization_goal || "REACH",
      campaign_id: firstAd.campaign_ID,
      campaign_name: firstAd.campaign_name,
      status: firstAd.status,
      created_at: firstAd.created_at,
      ad_count: ads.length,
      ads: ads.map((ad) => ({
        id: ad.id,
        name: ad.ad_name || "Untitled Ad",
        status: ad.status,
        created_at: ad.created_at,
      })),
    };

    // Update adset status to the most advanced one
    const statusPriority = {
      posted: 4,
      approved: 3,
      ready: 2,
      pending: 1,
    };

    let adsetStatus = adset.status;
    ads.forEach((ad) => {
      if (
        statusPriority[ad.status as keyof typeof statusPriority] >
        statusPriority[adsetStatus as keyof typeof statusPriority]
      ) {
        adsetStatus = ad.status;
      }
    });

    adset.status = adsetStatus;

    return NextResponse.json({
      success: true,
      data: adset,
      message: "Adset details fetched successfully",
    });
  } catch (error) {
    console.error("Fetch adset details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
