'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSense from '@/components/AdSense';
import { CATEGORY_LIST } from '@/lib/categories';
import AajKaSawalWidget from '@/components/AajKaSawalWidget';
import VideoPlayer from '@/components/VideoPlayer';

import { Post, sortPostsLatestFirst } from '@/lib/db';
import { getYouTubeThumbnailUrl } from '@/lib/video';

interface HomePageFeedProps {
  initialPosts: Post[];
}

export default function HomePageFeed({ initialPosts }: HomePageFeedProps) {
  const [posts, setPosts] = useState<Post[]>(sortPostsLatestFirst(initialPosts));
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    let merged = [...initialPosts];

    try {
      const localStr = localStorage.getItem('tanjnama_local_articles');
      if (localStr) {
        const localArticles: Post[] = JSON.parse(localStr);
        localArticles.forEach((lp) => {
          if (lp.status === 'published') {
            const idx = merged.findIndex((m) => m.id === lp.id || m.slug === lp.slug);
            if (idx !== -1) {
              merged[idx] = lp;
            } else {
              merged.unshift(lp);
            }
          }
        });
      }
    } catch (e) {
      console.warn('LocalStorage load notice on homepage');
    }

    setPosts(sortPostsLatestFirst(merged));

    // Async background sync only if initialPosts was sparse
    if (initialPosts.length < 5) {
      fetch('/api/posts')
        .then((res) => (res.ok ? res.json() : []))
        .then((apiPosts: Post[]) => {
          if (apiPosts && apiPosts.length > 0) {
            setPosts((prev) => {
              const updated = [...prev];
              apiPosts.forEach((ap) => {
                if (ap.status === 'published' && !updated.some((m) => m.id === ap.id || m.slug === ap.slug)) {
                  updated.push(ap);
                }
              });
              return sortPostsLatestFirst(updated);
            });
          }
        })
        .catch(() => {});
    }
  }, [initialPosts]);

  const heroPost = posts[0];
  const hotPosts = posts.slice(1, 4);
  const mainPosts = posts.slice(4);

  const homeVideoPosts = posts.filter((p) => Boolean(p.video_url && p.video_url.trim().length > 0));

  const getPostImage = (p: Post) => {
    if (p.featured_image && p.featured_image.trim().length > 0 && !p.featured_image.includes('/logo.png')) {
      return p.featured_image;
    }
    if (p.video_url && p.video_url.trim().length > 0) {
      const ytThumb = getYouTubeThumbnailUrl(p.video_url);
      if (ytThumb) return ytThumb;
    }
    return p.featured_image || '/logo.png';
  };

  const isFullCover = (p: Post) => {
    const img = getPostImage(p);
    return img !== '/logo.png' && !img.endsWith('/logo.png');
  };

  return (
    <div className="main-layout">
      {/* MAIN NEWS FEED */}
      <section className="feed-section">
        {posts.length === 0 ? (
          <div
            className="card"
            style={{
              padding: '48px 24px',
              textAlign: 'center',
              background: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              marginBottom: '32px'
            }}
          >
            <div style={{ fontSize: '42px', marginBottom: '12px' }}>📰</div>
            <h2 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 800, marginBottom: '8px' }}>
              स्वागत है TANJNAMA पर!
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              अभी कोई नया लेख प्रकाशित नहीं हुआ है। ताजा खबरों और निष्पक्ष विश्लेषण के लिए शीघ्र ही पुनः पधारें।
            </p>
          </div>
        ) : (
          <>
            {/* HERO SECTION */}
            {heroPost && (
              <div className="hero-grid">
                <div className="main-lead-card">
                  <div className="lead-image-box" style={{ background: '#000000', position: 'relative' }}>
                    {heroPost.video_url && playingVideoId === (heroPost.id || heroPost.slug) ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <VideoPlayer videoUrl={heroPost.video_url} title={heroPost.title} autoPlay={true} />
                        <button
                          onClick={() => setPlayingVideoId(null)}
                          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.85)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', zIndex: 20 }}
                        >
                          ✕ वीडियो बंद करें
                        </button>
                      </div>
                    ) : (
                      <Link href={`/posts/${heroPost.slug}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
                        <img
                          src={getPostImage(heroPost)}
                          alt={heroPost.title}
                          width="800"
                          height="450"
                          loading="eager"
                          // @ts-ignore
                          fetchpriority="high"
                          decoding="async"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: isFullCover(heroPost) ? 'cover' : 'contain',
                            padding: isFullCover(heroPost) ? '0' : '20px'
                          }}
                        />
                        {heroPost.video_url && (
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setPlayingVideoId(heroPost.id || heroPost.slug);
                            }}
                            style={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              background: 'rgba(211, 16, 24, 0.95)',
                              color: '#fff',
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '24px',
                              boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                              cursor: 'pointer'
                            }}
                            title="होमपेज पर वीडियो प्ले करें"
                          >
                            ▶
                          </div>
                        )}
                        <span className="cat-badge">{heroPost.category}</span>
                      </Link>
                    )}
                  </div>
                  <div className="lead-content">
                    <h1>
                      <Link href={`/posts/${heroPost.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {heroPost.title}
                      </Link>
                    </h1>
                    <p>{heroPost.excerpt}</p>
                    <div className="post-meta-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span>✍️ {heroPost.author}</span>
                        <span style={{ margin: '0 6px' }}>•</span>
                        <span>📅 {new Date(heroPost.published_at || Date.now()).toLocaleDateString('hi-IN')}</span>
                      </div>
                      {heroPost.video_url && (
                        <button
                          onClick={() => setPlayingVideoId(playingVideoId === (heroPost.id || heroPost.slug) ? null : (heroPost.id || heroPost.slug))}
                          style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                        >
                          {playingVideoId === (heroPost.id || heroPost.slug) ? '⏸️ वीडियो बंद करें' : '▶ होमपेज पर प्ले करें'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* HOT STORIES COLUMN */}
                {hotPosts.length > 0 && (
                  <div className="hot-stories-list">
                    <div className="section-title-box" style={{ marginBottom: '14px' }}>
                      <h2 style={{ fontSize: '18px' }}>🔥 ट्रेंडिंग खबरें</h2>
                    </div>
                    {hotPosts.map((p) => (
                      <div className="hot-story-item" key={p.id || p.slug} style={{ display: 'flex', gap: '12px' }}>
                        <div className="hot-story-thumb" style={{ background: '#f8fafc', position: 'relative' }}>
                          <Link href={`/posts/${p.slug}`}>
                            <img
                              src={getPostImage(p)}
                              alt={p.title}
                              width="140"
                              height="90"
                              loading="lazy"
                              decoding="async"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: isFullCover(p) ? 'cover' : 'contain',
                                padding: isFullCover(p) ? '0' : '8px'
                              }}
                            />
                          </Link>
                          {p.video_url && (
                            <div
                              onClick={() => setPlayingVideoId(playingVideoId === (p.id || p.slug) ? null : (p.id || p.slug))}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(211, 16, 24, 0.9)',
                                color: '#fff',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '14px',
                                cursor: 'pointer'
                              }}
                              title="वीडियो देखें"
                            >
                              ▶
                            </div>
                          )}
                        </div>
                        <div className="hot-story-info">
                          <h3>
                            <Link href={`/posts/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                              {p.title}
                            </Link>
                          </h3>
                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
                            {p.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}



        {/* SARCASM SPOTLIGHT BOX */}
        <div
          style={{
            background: '#000000',
            color: '#ffffff',
            borderRadius: '6px',
            padding: '22px',
            marginBottom: '32px',
            borderLeft: '6px solid var(--primary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '2px', textTransform: 'uppercase' }}>
              🎭 सोच पर तंज, सच के साथ
            </span>
          </div>
          <blockquote style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', lineHeight: '1.4', color: '#ffffff', fontStyle: 'italic' }}>
            "खबरों के बीच का तंज ही वह आईना है, जिसमें राजनीति की असली सूरत साफ दिखाई देती है।"
          </blockquote>
          <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '8px' }}>— TANJNAMA Editorial Desk</p>
        </div>

        {/* LATEST POSTS GRID */}
        {mainPosts.length > 0 && (
          <>
            <div className="section-title-box">
              <h2>ताज़ा लेख एवं विश्लेषण</h2>
              <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>नवीनतम अपडेट</span>
            </div>

            <div className="posts-grid">
              {mainPosts.map((p) => {
                const isPlaying = playingVideoId === (p.id || p.slug);
                return (
                  <div className="post-card" key={p.id || p.slug}>
                    <div className="post-card-image" style={{ background: '#f8fafc', position: 'relative' }}>
                      {p.video_url && isPlaying ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <VideoPlayer videoUrl={p.video_url} title={p.title} autoPlay={true} />
                          <button
                            onClick={() => setPlayingVideoId(null)}
                            style={{
                              position: 'absolute',
                              top: '6px',
                              right: '6px',
                              background: 'rgba(220,38,38,0.9)',
                              color: '#fff',
                              border: 'none',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              zIndex: 10
                            }}
                          >
                            ✕ बंद
                          </button>
                        </div>
                      ) : (
                        <Link href={`/posts/${p.slug}`} style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}>
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
                              objectFit: isFullCover(p) ? 'cover' : 'contain',
                              padding: isFullCover(p) ? '0' : '16px'
                            }}
                          />
                          {p.video_url && (
                            <div
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setPlayingVideoId(p.id || p.slug);
                              }}
                              style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                background: 'rgba(211, 16, 24, 0.95)',
                                color: '#ffffff',
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
                              }}
                              title="वीडियो प्ले करें"
                            >
                              ▶
                            </div>
                          )}
                          <span className="cat-badge">{p.category}</span>
                        </Link>
                      )}
                    </div>
                    <div className="post-card-content">
                      <h3>
                        <Link href={`/posts/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {p.title}
                        </Link>
                      </h3>
                      <p>{p.excerpt}</p>
                      <div className="post-meta-line" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{new Date(p.published_at || Date.now()).toLocaleDateString('hi-IN')} • {p.author}</span>
                        {p.video_url && (
                          <button
                            onClick={() => setPlayingVideoId(isPlaying ? null : (p.id || p.slug))}
                            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}
                          >
                            {isPlaying ? '⏸️ बंद' : '▶ प्ले'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* IN-FEED ADSENSE PLACEMENT */}
        <AdSense slot="in-feed-home" format="auto" />
      </section>

      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* AAJ KA SAWAL LIVE POLL WIDGET */}
        <AajKaSawalWidget />

        {/* SIDEBAR ADSENSE WIDGET */}
        <div className="sidebar-widget">
          <AdSense slot="sidebar-home" format="auto" />
        </div>

        {/* POPULAR POSTS WIDGET */}
        {posts.length > 0 && (
          <div className="sidebar-widget">
            <h3 className="widget-title">📌 सर्वाधिक पढ़े गए लेख</h3>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {posts.slice(0, 5).map((p, i) => (
                <Link href={`/posts/${p.slug}`} className="popular-item" key={p.id || p.slug}>
                  <span className="popular-num">{String(i + 1).padStart(2, '0')}</span>
                  <span className="popular-text">{p.title}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CATEGORIES WIDGET WITH ENGLISH URL SLUGS */}
        <div className="sidebar-widget">
          <h3 className="widget-title">🏷️ विषय व श्रेणियां</h3>
          <div className="cat-pills">
            {CATEGORY_LIST.map((c) => (
              <Link key={c.slug} href={c.slug === 'nagrik-patrakarita' ? '/nagrik-patrakarita' : `/category/${c.slug}`} className="cat-pill">
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {/* NEWSLETTER SUBSCRIPTION WIDGET */}
        <div className="sidebar-widget" style={{ background: '#000000', color: '#ffffff' }}>
          <h3 className="widget-title" style={{ color: '#ffffff' }}>📧 TANJNAMA न्यूज़लेटर</h3>
          <p style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '14px' }}>
            दैनिक मुख्य खबरें और सोच पर तंज सीधे अपने इनबॉक्स में पाएं।
          </p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} action="#" method="post">
            <input
              type="email"
              placeholder="अपना ईमेल दर्ज करें..."
              required
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid #334155', background: '#111', color: '#fff', fontSize: '13px' }}
            />
            <button type="submit" className="btn-primary">सब्सक्राइब करें</button>
          </form>
        </div>
      </aside>
    </div>
  );
}
