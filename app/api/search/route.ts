import { NextResponse } from 'next/server';
import { searchPosts } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = await searchPosts(q);
  return NextResponse.json(results);
}
