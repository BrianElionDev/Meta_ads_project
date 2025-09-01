import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { AdCampaign } from "@/types/adCreation";

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json();
    const ad: AdCampaign= body;

    const response = await axios.post('https://brianeliondev.app.n8n.cloud/webhook/38941a23-94bd-40f3-8d11-87b3b955d6c7', {
        method: 'POST',
        body: JSON.stringify(ad),
    });
    const data = await response.data;
    
    if (response.status !== 200) {
        return NextResponse.json({error: response.data.message}, {status: 500});
    }
    return NextResponse.json({data, message: 'Ad creation request sent to n8n.'}, {status: 200});
}