import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPost, getPublishedPosts } from '@/lib/db';
import AdSense from '@/components/AdSense';

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPost(slug);
  if (!p) return {};
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
  const p = await getPost(slug);
  if (!p) notFound();

  const allPosts = await getPublishedPosts(6);
  const relatedPosts = allPosts.filter((item) => item.slug !== p.slug).slice(0, 3);

  // Calculate estimated reading time
  const wordCount = p.content.split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));

  const postUrl = `https://thetanjnama-omega.vercel.app/posts/${p.slug}`;

  return (
    <main className="page-container">
      <article className="article-container">
        {/* CATEGORY & METADATA */}
        <div className="article-header">
          <span className="cat-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '12px' }}>
            {p.category}
          </span>
          <h1 className="article-title">{p.title}</h1>

          <div className="article-meta-row">
            <span>✍️ <strong>{p.author}</strong></span>
            <span>•</span>
            <span>📅 {p.published_at ? new Date(p.published_at).toLocaleDateString('hi-IN') : 'हाल ही में'}</span>
            <span>•</span>
            <span>⏱️ {readTimeMin} मिनट पठन</span>
          </div>
        </div>

        {/* FEATURED IMAGE */}
        {p.featured_image && (
          <img src={p.featured_image} alt={p.title} className="article-featured-img" />
        )}

        {/* EXCERPT LEAD */}
        <p className="article-lead">{p.excerpt}</p>

        {/* TOP AD PLACEMENT */}
        <AdSense slot="article-top" format="horizontal" />

        {/* ARTICLE CONTENT */}
        <div className="article-body-text">
          {p.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('<h2>')) {
              const cleanHeading = paragraph.replace(/<\/?h2>/g, '');
              return (
                <h2 key={index} style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: '28px 0 14px', color: 'var(--dark-bg)' }}>
                  {cleanHeading}
                </h2>
              );
            }
            if (paragraph.startsWith('<blockquote>')) {
              const cleanQuote = paragraph.replace(/<\/?blockquote>/g, '');
              return (
                <blockquote
                  key={index}
                  style={{
                    borderLeft: '4px solid var(--primary)',
                    background: '#f8fafc',
                    padding: '16px 20px',
                    margin: '20px 0',
                    fontStyle: 'italic',
                    borderRadius: '0 8px 8px 0'
                  }}
                >
                  {cleanQuote}
                </blockquote>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        {/* IN-ARTICLE BOTTOM AD PLACEMENT */}
        <AdSense slot="article-bottom" format="auto" />

        {/* SOCIAL SHARE BAR */}
        <div className="share-bar">
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--dark-bg)' }}>शेयर करें:</span>
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(p.title + ' ' + postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn share-whatsapp"
          >
            WhatsApp
          </a>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn share-fb"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(p.title)}&url=${encodeURIComponent(postUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-btn share-twitter"
          >
            X (Twitter)
          </a>
        </div>

        {/* RELATED ARTICLES */}
        <div style={{ marginTop: '40px' }}>
          <h3 className="widget-title">📰 सम्बंधित लेख</h3>
          <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {relatedPosts.map((rp) => (
              <Link href={`/posts/${rp.slug}`} className="post-card" key={rp.id}>
                <div className="post-card-image" style={{ height: '130px' }}>
                  <img
                    src={
                      rp.featured_image ||
                      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&q=80'
                    }
                    alt={rp.title}
                  />
                </div>
                <div className="post-card-content" style={{ padding: '12px' }}>
                  <h4 style={{ fontSize: '14px', lineHeight: 1.3, marginBottom: '6px' }}>{rp.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}