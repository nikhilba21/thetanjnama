'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AajKaSawalWidget from '@/components/AajKaSawalWidget';
import VideoPlayer from '@/components/VideoPlayer';

import { Post, sortPostsLatestFirst } from '@/lib/db';
import { getYouTubeThumbnailUrl } from '@/lib/video';
import { formatDateSafe } from '@/lib/date';

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
  const [posts, setPosts] = useState<Post[]>(sortPostsLatestFirst(initialPosts));
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const getPostImage = (p: Post) => {
    if (p.featured_image && p.featured_image.trim().length > 0 && !p.featured_image.includes('/logo.png') && !p.featured_image.includes('/logo.webp')) {
      return p.featured_image;
    }
    if (p.video_url && p.video_url.trim().length > 0) {
      const ytThumb = getYouTubeThumbnailUrl(p.video_url);
      if (ytThumb) return ytThumb;
    }
    return '/default-cover.webp';
  };

  const isFullCover = (p: Post) => {
    const img = getPostImage(p);
    return Boolean(img && !img.includes('/logo.png') && !img.includes('/logo.webp'));
  };

  const targetSlug = decodeURIComponent(categorySlug).toLowerCase().trim();
  const targetName = categoryName.toLowerCase().trim();
  const isVideoCategory =
    targetSlug === 'videos' ||
    targetSlug === 'video' ||
    targetSlug === 'वीडियो' ||
    targetSlug === 'वीडियो समाचार' ||
    targetSlug.includes('video') ||
    targetSlug.includes('वीडियो') ||
    targetName === 'videos' ||
    targetName === 'video' ||
    targetName === 'वीडियो' ||
    targetName === 'वीडियो समाचार' ||
    targetName.includes('video') ||
    targetName.includes('वीडियो');

  useEffect(() => {
    let combined: Post[] = [...initialPosts];

    // 1. Fetch from LocalStorage backup
    try {
      const localStr = localStorage.getItem('tanjnama_local_articles');
      if (localStr) {
        const localList: Post[] = JSON.parse(localStr);
        localList.forEach((lp) => {
          if (!combined.some((cp) => cp.id === lp.id || cp.slug === lp.slug)) {
            combined.unshift(lp);
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage category sync notice');
    }

    // Filter helper
    const filterFn = (items: Post[]) => {
      return items.filter((p) => {
        if (!p || !p.title) return false;
        if (p.status === 'draft') return false;

        const cat = (p.category || '').toLowerCase().trim();
        const hasVideoUrl = Boolean(p.video_url && p.video_url.trim().length > 0);

        if (isVideoCategory) {
          return (
            hasVideoUrl ||
            cat === 'videos' ||
            cat === 'video' ||
            cat === 'वीडियो' ||
            cat === 'वीडियो समाचार' ||
            cat.includes('video') ||
            cat.includes('वीडियो')
          );
        }

        return (
          cat === targetSlug ||
          cat === targetName ||
          targetSlug.includes(cat) ||
          (cat.length > 2 && targetSlug.includes(cat))
        );
      });
    };

    setPosts(sortPostsLatestFirst(filterFn(combined)));

    // Fetch from API in background if initial dataset is small
    if (initialPosts.length < 3) {
      fetch('/api/posts')
        .then((res) => (res.ok ? res.json() : []))
        .then((apiPosts: Post[]) => {
          if (apiPosts && apiPosts.length > 0) {
            const extraMerged = [...combined];
            apiPosts.forEach((ap) => {
              if (!extraMerged.some((cp) => cp.id === ap.id || cp.slug === ap.slug)) {
                extraMerged.unshift(ap);
              }
            });
            setPosts(sortPostsLatestFirst(filterFn(extraMerged)));
          }
        })
        .catch(() => {});
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
              <p style={{ fontSize: '15px', color: '#64748b', marginBottom: '16px' }}>
                इस श्रेणी में अभी कोई नया लेख प्रकाशित नहीं हुआ है। ताजा खबरों के लिए शीघ्र ही पुनः पधारें।
              </p>
              <Link href="/" className="btn-primary" style={{ display: 'inline-block' }}>
                होमपेज पर वापस जाएं
              </Link>
            </div>
          ) : isVideoCategory ? (
            /* FULL THUMBNAIL GRID VIEW FOR VIDEOS CATEGORY */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '22px' }}>
              {posts.map((p) => {
                const isPlaying = playingVideoId === (p.id || p.slug);
                return (
                  <div
                    key={p.id || p.slug}
                    className="card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', background: '#000000' }}>
                      {p.video_url && isPlaying ? (
                        <div style={{ position: 'relative', width: '100%' }}>
                          <VideoPlayer videoUrl={p.video_url} title={p.title} autoPlay={true} />
                          <button
                            onClick={() => setPlayingVideoId(null)}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              background: 'rgba(220, 38, 38, 0.9)',
                              color: '#fff',
                              border: 'none',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontWeight: 700,
                              zIndex: 10
                            }}
                          >
                            ✕ बंद करें
                          </button>
                        </div>
                      ) : (
                        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9' }}>
                          <img
                            src={getPostImage(p)}
                            alt={p.title}
                            width="400"
                            height="225"
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          {p.video_url && (
                            <div
                              onClick={() => setPlayingVideoId(p.id || p.slug)}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(211, 16, 24, 0.95)',
                                color: '#ffffff',
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                cursor: 'pointer',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.4)'
                              }}
                              title="वीडियो प्ले करें"
                            >
                              ▶
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                          <span className="card-tag">{p.category}</span>
                          {p.video_url && (
                            <span style={{ background: '#dc2626', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                              ▶ VIDEO
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', lineHeight: 1.4, marginBottom: '8px' }}>
                          <Link href={`/posts/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {p.title}
                          </Link>
                        </h3>
                        {p.excerpt && (
                          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '14px' }}>
                            {p.excerpt}
                          </p>
                        )}
                      </div>

                      <div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                          ✍️ {p.author} • 📅 {formatDateSafe(p.published_at)}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {p.video_url && (
                            <button
                              onClick={() => setPlayingVideoId(isPlaying ? null : (p.id || p.slug))}
                              style={{
                                flex: 1,
                                background: isPlaying ? '#475569' : '#dc2626',
                                color: '#ffffff',
                                border: 'none',
                                padding: '8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              {isPlaying ? '⏸️ बंद करें' : '▶ यहाँ प्ले करें'}
                            </button>
                          )}
                          <Link
                            href={`/posts/${p.slug}`}
                            style={{
                              background: '#0f172a',
                              color: '#ffffff',
                              padding: '8px 12px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: 600,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                          >
                            🔗 पूरा देखें
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* STANDARD LIST VIEW FOR REGULAR CATEGORIES */
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
                        src={getPostImage(p)}
                        alt={p.title}
                        width="220"
                        height="140"
                        loading="lazy"
                        decoding="async"
                        style={{
                          width: '100%',
                          height: '140px',
                          objectFit: isFullCover(p) ? 'cover' : 'contain',
                          background: '#f8fafc',
                          padding: isFullCover(p) ? '0' : '12px',
                          borderRadius: '6px'
                        }}
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
                      {p.author} • {formatDateSafe(p.published_at)}
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
