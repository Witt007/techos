import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsCollection } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const ipFromHeader = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
    const ip = ipFromHeader.split(',')[0].trim();

    const geo = (request as any).geo || null;

    const {
      sessionId,
      path,
      referrer,
      userAgent,
      screen,
      timezone,
      language,
      languages,
      timestamp,
    } = body || {};

    if (!sessionId || !path) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const document = {
      sessionId,
      path,
      referrer: referrer || null,
      userAgent: userAgent || null,
      screen: screen || null,
      timezone: timezone || null,
      language: language || null,
      languages: languages || null,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      ip: ip || null,
      geo: geo
        ? {
            country: geo.country || null,
            region: geo.region || null,
            city: geo.city || null,
            latitude: geo.latitude ?? null,
            longitude: geo.longitude ?? null,
          }
        : null,
    };

    const collection = await getAnalyticsCollection();
    await collection.insertOne(document);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error in /api/analytics/collect:', error);
    return NextResponse.json({ ok: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
