import { NextResponse } from 'next/server';

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

  const diag = {
    hasUrl: Boolean(base),
    urlPreview: base ? `${base.slice(0, 15)}...` : 'MISSING',
    hasKey: Boolean(key),
    keyLength: key ? key.length : 0,
    supabaseStatus: 'UNTRIED',
    supabaseError: null as string | null,
    postsCount: 0
  };

  if (!base || !key) {
    return NextResponse.json({
      status: 'CONFIG_MISSING',
      message: 'Vercel Environment Variables me Supabase URL ya Key nahi mili!',
      diagnostics: diag
    });
  }

  try {
    const res = await fetch(`${base}/rest/v1/posts?select=id,title,status&limit=5`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    diag.supabaseStatus = `${res.status} ${res.statusText}`;

    if (res.ok) {
      const data = await res.json();
      diag.postsCount = Array.isArray(data) ? data.length : 0;
      return NextResponse.json({
        status: 'CONNECTED_SUCCESSFULLY',
        message: 'Supabase Database connected successfully!',
        diagnostics: diag,
        sampleData: data
      });
    } else {
      const errText = await res.text();
      diag.supabaseError = errText;
      return NextResponse.json(
        {
          status: 'SUPABASE_ERROR',
          message: `Supabase Error (${res.status}): ${errText}`,
          diagnostics: diag
        },
        { status: 500 }
      );
    }
  } catch (e: any) {
    diag.supabaseError = e.message || String(e);
    return NextResponse.json(
      {
        status: 'FETCH_EXCEPTION',
        message: `Network Exception: ${e.message}`,
        diagnostics: diag
      },
      { status: 500 }
    );
  }
}
