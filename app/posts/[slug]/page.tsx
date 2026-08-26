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

  const pageUrl = `https://thetanjnama-omega.vercel.app/posts/${p.slug}`;
  const imageUrl = p.featured_image || 'https://thetanjnama-omega.vercel.app/logo.png';

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
            url: `https://thetanjnama-omega.vercel.app/posts/${post.slug}`,
            image: post.featured_image ? [post.featured_image] : ['https://thetanjnama-omega.vercel.app/logo.png'],
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
                url: 'https://thetanjnama-omega.vercel.app/logo.png'
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
                item: 'https://thetanjnama-omega.vercel.app'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: post.category,
                item: `https://thetanjnama-omega.vercel.app/category/${encodeURIComponent(post.category)}`
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://thetanjnama-omega.vercel.app/posts/${post.slug}`
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