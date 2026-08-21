import { NextResponse } from 'next/server';
import { createPost, getAdminPosts } from '@/lib/db';

export async function GET() {
  try {
    const posts = await getAdminPosts();
    return NextResponse.json(posts);
  } catch (e) {
    return NextResponse.json({ error: 'Database read failed' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.title || !body.slug || !body.content) {
      return NextResponse.json(
        { error: 'शीर्षक (title), स्लग (slug) और लेख सामग्री (content) अनिवार्य हैं।' },
        { status: 400 }
      );
    }
    const created = await createPost(body);
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Unable to save article' }, { status: 500 });
  }
}