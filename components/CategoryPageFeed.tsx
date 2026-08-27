'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AajKaSawalWidget from '@/components/AajKaSawalWidget';

type Post = {
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
  created_at?: string;
};

interface CategoryPageFeedProps {
  categorySlug: string;
  categoryName: string;
  initialPosts: Post[];
}

export default function CategoryPageFeed({
  categorySlug,
  categoryName,
  initialPosts
}: CategoryPageFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  useEffect(() => {
    try {
      const localStr = localStorage.getItem('tanjnama_local_articles');
      let combined = [...initialPosts];

      if (localStr) {
        const localList: Post[] = JSON.parse(localStr);
        localList.forEach((lp) => {
          if (!combined.some((cp) => cp.id === lp.id || cp.slug === lp.slug)) {
            combined.unshift(lp);
          }
        });
      }

      const target = decodeURIComponent(categorySlug).toLowerCase().trim();
      const targetName = categoryName.toLowerCase().trim();
      const isVideoCategory =
        target === 'videos' ||
        target === 'video' ||
        targetName === 'videos' ||
        targetName === 'वीडियो';

      const filtered = combined.filter((p) => {
        // Exclude explicit drafts if status is draft
        if (p.status === 'draft') return false;

        const cat = (p.category || '').toLowerCase().trim();

        if (isVideoCategory) {
          return (
            Boolean(p.video_url && p.video_url.trim().length > 0) ||
            cat === 'videos' ||
            cat === 'video' ||
            cat === 'वीडियो' ||
            cat.includes('video')
          );
        }

        return cat === target || cat === targetName;
      });

      setPosts(filtered);
    } catch (e) {
      console.warn('LocalStorage category sync error');
    }
  }, [categorySlug, categoryName, initialPosts]);

  return (
    <div className="container">
      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
        <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>
          होम
        </Link>{' '}
        / <span>{categoryName}</span>
      </div>

      <div className="layout-grid">
        {/* Main Category Feed */}
        <div className="feed-main">
          <div className="section-header" style={{ marginBottom: '24px' }}>
            <h1 className="section-title" style={{ fontSize: '26px' }}>
              {categoryName}
            </h1>
            <span style={{ fontSize: '13px', color: '#64748b' }}>({posts.length} खबरें)</span>
          </div>

          {posts.length === 0 ? (
            <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
              <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '8px' }}>
                इस श्रेणी में अभी कोई खबर प्रकाशित नहीं हुई है।
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
                (यदि आपने एडमिन से खबर जोड़ी है, तो सुनिश्चित करें कि स्टेटस <strong>'Published (लाइव वेबसाइट)'</strong> सेट हो)
              </p>
              <Link href="/" className="btn-primary" style={{ display: 'inline-block' }}>
                होमपेज पर वापस जाएं
              </Link>
            </div>
          ) : (
            <div className="article-feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {posts.map((p) => (
                <article
                  key={p.id || p.slug}
                  className="card flex-row-card"
                  style={{ display: 'flex', gap: '20px', padding: '16px' }}
                >
                  {(p.featured_image || p.video_url) && (
                    <Link href={`/posts/${p.slug}`} style={{ flexShrink: 0, width: '220px', position: 'relative' }}>
                      <img
                        src={
                          p.featured_image ||
                          'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=400&q=80'
                        }
                        alt={p.title}
                        style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                      />
                      {p.video_url && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'rgba(211, 16, 24, 0.9)',
                            color: '#fff',
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                          }}
                        >
                          ▶
                        </div>
                      )}
                    </Link>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                      <span className="card-tag" style={{ width: 'fit-content' }}>
                        {p.category}
                      </span>
                      {p.video_url && (
                        <span
                          style={{
                            background: '#dc2626',
                            color: '#fff',
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          ▶ VIDEO
                        </span>
                      )}
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', lineHeight: '1.4' }}>
                      <Link href={`/posts/${p.slug}`} style={{ color: '#111' }}>
                        {p.title}
                      </Link>
                    </h2>
                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', marginBottom: '10px' }}>
                      {p.excerpt}
                    </p>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      {p.author} • {p.published_at ? new Date(p.published_at).toLocaleDateString('hi-IN') : 'हाल ही में'}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="feed-sidebar">
          <AajKaSawalWidget />
        </aside>
      </div>
    </div>
  );
}
