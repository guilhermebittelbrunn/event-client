import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/clients/client';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const secret = process.env.NEXT_API_SECRET;

    if (secret) {
        client.addHeaders({ 'x-api-secret': secret });
    }

    await client.webhookService.processPayment(body);

    return NextResponse.json({ message: 'Webhook received' });
}
