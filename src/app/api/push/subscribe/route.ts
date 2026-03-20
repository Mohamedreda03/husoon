import { NextResponse } from 'next/server';
import { savePushSubscription } from '@/lib/appwrite/database';

export async function POST(req: Request) {
  try {
    const { userId, subscription } = await req.json();
    
    if (!userId || !subscription) {
      return NextResponse.json({ error: 'Missing userId or subscription' }, { status: 400 });
    }

    await savePushSubscription(userId, subscription);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error in subscribe route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
