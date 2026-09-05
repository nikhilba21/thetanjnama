import type { Metadata } from 'next';
import { getPost, getPublishedPosts } from '@/lib/db';
import ArticleDetailView from '@/components/ArticleDetailView';
import { getYouTubeThumbnailUrl } from '@/lib/video';

export const revalidate = 60;

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return { title: 'लेख | TANJNAMA' };

  const pageUrl = `https://www.tanjnama.com/posts/${p.slug}`;
  const ytThumb = p.video_url ? getYouTubeThumbnailUrl(p.video_url) : null;
  const imageUrl =
    p.featured_image && p.featured_image.trim().length > 0 && !p.featured_image.includes('/logo.png')
      ? p.featured_image
      : (ytThumb || p.featured_image || 'https://www.tanjnama.com/logo.png');

  return {
    title: p.seo_title || `${p.title} | TANJNAMA`,
    description: p.seo_description || p.excerpt,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: p.title,
      description: p.excerpt,
      url: pageUrl,
      type: 'article',
      publishedTime: p.published_at || p.created_at,
      authors: [p.author || 'TANJNAMA Desk'],
      images: [{ url: imageUrl, alt: p.title }]
    },
    twitter: {
      card: 'summary_large_image',
      title: p.title,
      description: p.excerpt,
      images: [imageUrl]
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

  // NewsArticle & Breadcrumb JSON-LD Structured Data Schema
  const articleJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'NewsArticle',
            headline: post.title,
            description: post.excerpt,
            url: `https://www.tanjnama.com/posts/${post.slug}`,
            image: post.featured_image ? [post.featured_image] : ['https://www.tanjnama.com/logo.png'],
            datePublished: post.published_at || post.created_at,
            dateModified: post.updated_at || post.published_at || post.created_at,
            author: {
              '@type': 'Person',
              name: post.author || 'TANJNAMA Desk'
            },
            publisher: {
              '@type': 'Organization',
              name: 'TANJNAMA',
              logo: {
                '@type': 'ImageObject',
                url: 'https://www.tanjnama.com/logo.png'
              }
            },
            articleSection: post.category
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'होम',
                item: 'https://www.tanjnama.com'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: post.category,
                item: `https://www.tanjnama.com/category/${encodeURIComponent(post.category)}`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://www.tanjnama.com/posts/${post.slug}`
              }
            ]
          }
        ]
      }
    : null;

  return (
    <main className="page-container">
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <ArticleDetailView initialPost={post} slug={slug} allPosts={allPosts} />
    </main>
  );
}