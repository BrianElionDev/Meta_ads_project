import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { AdCampaign } from "@/types/adCreation";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const ad: AdCampaign= body;
    const webhookUrl: string = process.env.N8N_WEBHOOK_URL || '';
    if (!webhookUrl) {
        return NextResponse.json({error: 'N8N webhook URL is not set'}, {status: 500});
    }

    const response = await axios.post(webhookUrl, {
        method: 'POST',
        body: JSON.stringify(ad),
    });
    const data = await response.data;
    
    if (response.status !== 200) {
        return NextResponse.json({error: response.data.message}, {status: 500});
    }
    return NextResponse.json({data, message: 'Ad creation request sent to n8n.'}, {status: 200});
}