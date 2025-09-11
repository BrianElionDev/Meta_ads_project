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

    const { id: adId } = await params;
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

    // Get the specific ad
    const { data: ad, error } = await supabase
      .from("ads")
      .select("*")
      .eq("id", adId)
      .eq("ad_account_ID", client.ad_account_ID)
      .single();

    if (error) {
      console.error("Database query error:", error);
      return NextResponse.json(
        { error: "Failed to fetch ad details" },
        { status: 500 }
      );
    }

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: ad,
      message: "Ad details fetched successfully",
    });
  } catch (error) {
    console.error("Fetch ad details error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
