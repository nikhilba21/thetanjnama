import { NextResponse } from 'next/server';
import { getPublishedPosts } from '@/lib/db';

export async function GET() {
  const posts = await getPublishedPosts(50);
  const details = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    featured_image_length: (p.featured_image || '').length,
    is_base64: (p.featured_image || '').startsWith('data:'),
    excerpt_length: (p.excerpt || '').length,
    content_length: (p.content || '').length
  }));

  const totalPayloadSize = JSON.stringify(posts).length;

  return NextResponse.json({
    posts_count: posts.length,
    total_json_payload_size_kb: (totalPayloadSize / 1024).toFixed(2),
    details
  });
}
