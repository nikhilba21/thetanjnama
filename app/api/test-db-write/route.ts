import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const base =
    process.env.TANJNAMA_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const key =
    process.env.TANJNAMA_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!base || !key) {
    return NextResponse.json({ error: 'Supabase credentials missing' }, { status: 500 });
  }

  const testPayload = {
    title: 'डायग्नोस्टिक टेस्ट पोस्ट — TANJNAMA DB',
    slug: `test-db-write-${Date.now()}`,
    excerpt: 'यह डेटाबेस कनेक्टिविटी और टेबल स्कीमा का लाइव टेस्ट है।',
    content: '<p>यह डेटाबेस टेस्ट कंटेंट है।</p>',
    category: 'राष्ट्रीय',
    author: 'तंजनामा डेस्क',
    status: 'published',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const res = await fetch(`${base}/rest/v1/posts`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(testPayload),
      cache: 'no-store'
    });

    const status = res.status;
    const text = await res.text();

    return NextResponse.json({
      httpStatus: status,
      isOk: res.ok,
      responseBody: text,
      testPayloadSent: testPayload
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
