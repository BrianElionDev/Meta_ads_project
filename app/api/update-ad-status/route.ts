import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabaseServer";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const {
      ad_id,
      status,
      step,
      n8n_workflow_id,
      campaign_ID,
      adset_ID,
      ad_creative_ID,
      ad_ID,
      facebook_image_url,
      ad_image_url,
    } = body;

    if (!ad_id || !status || !step) {
      return NextResponse.json(
        { error: "Missing required fields: ad_id, status, step" },
        { status: 400 }
      );
    }

    const supabase = await createServerClient();

    const updateData: Record<string, string | null> = {
      status,
    };

    // Only update IDs when they're provided
    if (campaign_ID) updateData.campaign_ID = campaign_ID;
    if (adset_ID) updateData.adset_ID = adset_ID;
    if (ad_creative_ID) updateData.ad_creative_ID = ad_creative_ID;
    if (ad_ID) updateData.ad_ID = ad_ID;
    if (facebook_image_url) updateData.facebook_image_url = facebook_image_url;
    if (ad_image_url) updateData.ad_image_url = ad_image_url;
    if (n8n_workflow_id) updateData.n8n_workflow_id = n8n_workflow_id;

    const { data, error } = await supabase
      .from("ads")
      .update(updateData)
      .eq("id", ad_id)
      .select()
      .single();

    if (error) {
      console.error("Database update error:", error);
      return NextResponse.json(
        { error: "Failed to update ad status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data,
      message: `Ad status updated to ${status} for step ${step}`,
    });
  } catch (error) {
    console.error("Update ad status error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
