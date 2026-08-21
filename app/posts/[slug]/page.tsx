import type { Metadata } from 'next';
import { getPost, getPublishedPosts } from '@/lib/db';
import ArticleDetailView from '@/components/ArticleDetailView';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: 'लेख | TANJNAMA' };
  return {
    title: p.seo_title || p.title,
    description: p.seo_description || p.excerpt,
    openGraph: {
      title: p.title,
      description: p.excerpt,
      images: p.featured_image ? [{ url: p.featured_image }] : []
    }
  };
}

export default async function ArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  const allPosts = await getPublishedPosts(6);

  return (
    <main className="page-container">
      <ArticleDetailView initialPost={post} slug={slug} allPosts={allPosts} />
    </main>
  );
}