import { NextResponse } from 'next/server';
import { getPageBySlug, getAllPages, updatePageContent } from '@/lib/pages';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    if (slug) {
      const page = getPageBySlug(slug);
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json(page);
    }
    const all = getAllPages();
    return NextResponse.json(all);
  } catch (e) {
    return NextResponse.json({ error: 'Unable to fetch pages' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    if (!body.slug || !body.title || !body.content) {
      return NextResponse.json({ error: 'Slug, title, and content are required' }, { status: 400 });
    }

    const updated = updatePageContent(body.slug, body.title, body.content);
    if (!updated) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: 'Unable to update page' }, { status: 500 });
  }
}
