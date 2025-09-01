import { Client } from "@/types/client";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();
  const client: Client = body;

  const { data, error } = await supabase
    .from("clients")
    .insert({
      name: client.name,
      ad_account_ID: client.ad_account_ID,
      page_ID: client.page_ID,
      pixel_ID: client.pixel_ID,
      instagram_ID: client.instagram_ID,
      whatsapp_ID: client.whatsapp_ID,
      email: client.email,
      country: client.country,
      business: client.business,
      organization_email: client.organization_email,
    })
    .select();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(
    { data, message: "Client created successfully" },
    { status: 200 }
  );
}
