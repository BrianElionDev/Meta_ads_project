import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { AdCampaign } from "@/types/adCreation";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
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

    console.log("Attempting to send to N8N webhook:", webhookUrl);

    // Send the data to N8N webhook via POST request with data in body
    const response = await axios.post(webhookUrl, ad, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
      validateStatus: () => true, // Don't throw on non-2xx status codes
    });

    console.log("N8N response status:", response.status);
    console.log("N8N response data:", response.data);

    if (response.status === 200) {
      return NextResponse.json(
        {
          data: response.data,
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
