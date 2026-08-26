import type { MetadataRoute } from 'next';
import { getPublishedPosts } from '@/lib/db';
import { CATEGORY_LIST } from '@/lib/categories';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://thetanjnama-omega.vercel.app';
  const posts = await getPublishedPosts(100);

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/privacy-policy',
    '/disclaimer'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8
  }));

  const categoryPages = CATEGORY_LIST.map((c) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8
  }));

  const postPages = posts.map((p) => ({
    url: `${baseUrl}/posts/${p.slug}`,
    lastModified: p.updated_at || p.published_at || new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
