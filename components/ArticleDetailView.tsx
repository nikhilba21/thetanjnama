'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSense from '@/components/AdSense';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  status: 'draft' | 'published';
  published_at?: string | null;
};

interface ArticleDetailViewProps {
  initialPost: Post | null;
  slug: string;
  allPosts: Post[];
}

export default function ArticleDetailView({ initialPost, slug, allPosts }: ArticleDetailViewProps) {
  const [post, setPost] = useState<Post | null>(initialPost);

  useEffect(() => {
    if (!initialPost) {
      try {
        const localStr = localStorage.getItem('tanjnama_local_articles');
        if (localStr) {
          const localList: Post[] = JSON.parse(localStr);
          const found = localList.find((p) => p.slug === slug);
          if (found) {
            setPost(found);
          }
        }
      } catch (e) {
        console.warn('LocalStorage post search error');
      }
    }
  }, [initialPost, slug]);

  if (!post) {
    return (
      <div style={{ background: '#ffffff', padding: '60px 20px', textAlign: 'center', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '10px' }}>404 — लेख नहीं मिला</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>यह लेख उपलब्ध नहीं है या हटा दिया गया है।</p>
        <Link href="/" className="btn-primary">🏠 मुख्य पृष्ठ पर लौटें</Link>
      </div>
    );
  }

  const relatedPosts = allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const wordCount = post.content.split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));
  const postUrl = typeof window !== 'undefined' ? window.location.href : `https://thetanjnama-omega.vercel.app/posts/${post.slug}`;

  return (
    <article className="article-container">
      {/* CATEGORY & METADATA */}
      <div className="article-header">
        <span className="cat-badge" style={{ position: 'static', display: 'inline-block', marginBottom: '12px' }}>
          {post.category}
        </span>
        <h1 className="article-title">{post.title}</h1>

        <div className="article-meta-row">
          <span>✍️ <strong>{post.author}</strong></span>
          <span>•</span>
          <span>📅 {post.published_at ? new Date(post.published_at).toLocaleDateString('hi-IN') : 'हाल ही में'}</span>
          <span>•</span>
          <span>⏱️ {readTimeMin} मिनट पठन</span>
        </div>
      </div>

      {/* FEATURED IMAGE */}
      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} className="article-featured-img" />
      )}

      {/* EXCERPT LEAD */}
      <p className="article-lead">{post.excerpt}</p>

      {/* TOP AD PLACEMENT */}
      <AdSense slot="article-top" format="horizontal" />

      {/* ARTICLE CONTENT */}
      <div className="article-body-text">
        {post.content.split('\n\n').map((paragraph, index) => {
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
                  background: '#fdf2f2',
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
          if (paragraph.includes('<img ')) {
            return <div key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />;
          }
          return <p key={index}>{paragraph}</p>;
        })}
      </div>

      {/* IN-ARTICLE BOTTOM AD PLACEMENT */}
      <AdSense slot="article-bottom" format="auto" />

      {/* SOCIAL SHARE BAR */}
      <div className="share-bar">
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000' }}>शेयर करें:</span>
        <a
          href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + postUrl)}`}
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
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
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
  );
}
