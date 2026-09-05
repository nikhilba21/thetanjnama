'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSense from '@/components/AdSense';
import VideoPlayer from '@/components/VideoPlayer';
import { getYouTubeThumbnailUrl } from '@/lib/video';
import { formatDateSafe } from '@/lib/date';

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  video_url?: string | null;
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
    try {
      const localStr = localStorage.getItem('tanjnama_local_articles');
      if (localStr) {
        const localArticles: Post[] = JSON.parse(localStr);
        const match = localArticles.find((p) => p.slug === slug || p.id === slug);
        if (match) {
          setPost(match);
        }
      }
    } catch (e) {
      console.warn('LocalStorage load notice on article page');
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="card" style={{ padding: '60px 20px', textAlign: 'center', margin: '40px auto', maxWidth: '600px' }}>
        <h2 style={{ fontSize: '22px', color: '#0f172a', marginBottom: '10px' }}>404 — लेख नहीं मिला</h2>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>यह लेख उपलब्ध नहीं है या हटा दिया गया है।</p>
        <Link href="/" className="btn-primary">🏠 मुख्य पृष्ठ पर लौटें</Link>
      </div>
    );
  }

  const relatedPosts = allPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  const wordCount = (post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTimeMin = Math.max(1, Math.ceil(wordCount / 180));
  const postUrl = typeof window !== 'undefined' ? window.location.href : `https://www.tanjnama.com/posts/${post.slug}`;

  const getPostImage = (p: Post) => {
    if (p.featured_image && p.featured_image.trim().length > 0 && !p.featured_image.includes('/logo.png') && !p.featured_image.includes('/logo.webp')) {
      return p.featured_image;
    }
    if (p.video_url && p.video_url.trim().length > 0) {
      const ytThumb = getYouTubeThumbnailUrl(p.video_url);
      if (ytThumb) return ytThumb;
    }
    return p.featured_image || '/default-cover.webp';
  };

  const isFullCover = (p: Post) => {
    const img = getPostImage(p);
    return img !== '/default-cover.webp' && !img.endsWith('/default-cover.webp');
  };

  const isDefaultLogo = !isFullCover(post);

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
          <span>📅 {formatDateSafe(post.published_at)}</span>
          <span>•</span>
          <span>⏱️ {readTimeMin} मिनट पठन</span>
        </div>
      </div>

      {/* EMBEDDED VIDEO PLAYER (IF VIDEO URL IS PRESENT) */}
      {post.video_url ? (
        <VideoPlayer videoUrl={post.video_url} title={post.title} />
      ) : (
        <div style={{ margin: '20px 0', borderRadius: '8px', overflow: 'hidden', background: '#f8fafc', border: '1px solid #cbd5e1', textAlign: 'center' }}>
          <img
            src={getPostImage(post)}
            alt={post.title}
            width="800"
            height="450"
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
            decoding="async"
            style={{
              width: isDefaultLogo ? 'auto' : '100%',
              maxWidth: isDefaultLogo ? '260px' : '100%',
              maxHeight: isDefaultLogo ? '200px' : '550px',
              height: 'auto',
              objectFit: isDefaultLogo ? 'contain' : 'cover',
              padding: isDefaultLogo ? '24px' : '0',
              margin: '0 auto',
              display: 'block'
            }}
          />
        </div>
      )}

      {/* EXCERPT LEAD */}
      {post.excerpt && <p className="article-lead">{post.excerpt}</p>}

      {/* TOP AD PLACEMENT */}
      <AdSense slot="article-top" format="horizontal" />

      {/* ARTICLE CONTENT (RICH HTML RENDERED SAFELY) */}
      <div
        className="article-body-text"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

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
      {relatedPosts.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 className="widget-title">📰 सम्बंधित लेख</h3>
          <div className="posts-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {relatedPosts.map((rp) => (
              <Link href={`/posts/${rp.slug}`} className="post-card" key={rp.id || rp.slug}>
                <div className="post-card-image" style={{ height: '130px', background: '#f8fafc' }}>
                  <img
                    src={getPostImage(rp)}
                    alt={rp.title}
                    width="260"
                    height="130"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: isFullCover(rp) ? 'cover' : 'contain',
                      padding: isFullCover(rp) ? '0' : '10px'
                    }}
                  />
                </div>
                <div className="post-card-content" style={{ padding: '12px' }}>
                  <h4 style={{ fontSize: '14px', lineHeight: 1.3, marginBottom: '6px' }}>{rp.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
