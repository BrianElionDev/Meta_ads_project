import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { AdCampaign } from "@/types/adCreation";
import { createServerClient } from "@/lib/supabaseServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const ad: AdCampaign = body;
    const webhookUrl: string = process.env.N8N_WEBHOOK_URL || "";

    console.log("Received campaign data:", ad);
    console.log("Webhook URL configured:", webhookUrl ? "Yes" : "No");

    if (!webhookUrl) {
      return NextResponse.json(
        {
          error:
            "N8N webhook URL is not configured. Please set N8N_WEBHOOK_URL environment variable.",
        },
        { status: 500 }
      );
    }

    // Get the user ID and their client's ad_account_ID
    const supabase = await createServerClient();
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

    // Send the data to N8N webhook directly
    const n8nPayload = {
      ...ad,
      ad_account_ID: client.ad_account_ID,
      webhook_callback_url: `${process.env.NEXTAUTH_URL}/api/update-ad-status`,
    };

    console.log("Attempting to send to N8N webhook:", webhookUrl);

    const response = await axios.post(webhookUrl, n8nPayload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      validateStatus: () => true,
    });

    console.log("N8N response status:", response.status);
    console.log("N8N response data:", response.data);

    if (response.status === 200) {
      return NextResponse.json(
        {
          data: {
            n8n_response: response.data,
          },
          message: "Ad creation request sent to N8N successfully.",
        },
        { status: 200 }
      );
    } else if (response.status === 404) {
      return NextResponse.json(
        {
          error:
            "N8N webhook endpoint not found (404). Please check the webhook URL configuration.",
        },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        {
          error: `N8N webhook returned status ${response.status}: ${response.statusText}`,
        },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error("Create ad API error:", error);

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        code: error.code,
        message: error.message,
      });

      if (error.response?.status === 404) {
        return NextResponse.json(
          {
            error:
              "N8N webhook endpoint not found (404). Please check the webhook URL configuration.",
          },
          { status: 500 }
        );
      }

      if (error.code === "ECONNREFUSED") {
        return NextResponse.json(
          {
            error:
              "Cannot connect to N8N webhook. Please check if the N8N service is running.",
          },
          { status: 500 }
        );
      }

      if (error.code === "ENOTFOUND") {
        return NextResponse.json(
          {
            error:
              "N8N webhook URL not found. Please check the URL configuration.",
          },
          { status: 500 }
        );
      }

      if (error.code === "ETIMEDOUT") {
        return NextResponse.json(
          {
            error:
              "N8N webhook request timed out. Please check if the service is responsive.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: `N8N webhook error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: `Internal server error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
