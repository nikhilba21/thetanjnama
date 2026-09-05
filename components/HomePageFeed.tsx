'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdSense from '@/components/AdSense';
import { CATEGORY_LIST } from '@/lib/categories';
import AajKaSawalWidget from '@/components/AajKaSawalWidget';

import { Post, sortPostsLatestFirst } from '@/lib/db';
import { getYouTubeThumbnailUrl } from '@/lib/video';

interface HomePageFeedProps {
  initialPosts: Post[];
}

export default function HomePageFeed({ initialPosts }: HomePageFeedProps) {
  const [posts, setPosts] = useState<Post[]>(sortPostsLatestFirst(initialPosts));

  useEffect(() => {
    async function loadAllHomePosts() {
      let merged = [...initialPosts];

      try {
        const res = await fetch('/api/posts');
        if (res.ok) {
          const apiPosts: Post[] = await res.json();
          apiPosts.forEach((ap) => {
            if (ap.status === 'published' && !merged.some((m) => m.id === ap.id || m.slug === ap.slug)) {
              merged.push(ap);
            }
          });
        }
      } catch (e) {
        console.warn('API fetch notice on home feed');
      }

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
    }

    loadAllHomePosts();
  }, [initialPosts]);

  const heroPost = posts[0];
  const hotPosts = posts.slice(1, 4);
  const mainPosts = posts.slice(4);

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
                <Link href={`/posts/${heroPost.slug}`} className="main-lead-card">
                  <div className="lead-image-box" style={{ background: '#f8fafc' }}>
                    <img
                      src={getPostImage(heroPost)}
                      alt={heroPost.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: isFullCover(heroPost) ? 'cover' : 'contain',
                        padding: isFullCover(heroPost) ? '0' : '20px'
                      }}
                    />
                    <span className="cat-badge">{heroPost.category}</span>
                  </div>
                  <div className="lead-content">
                    <h1>{heroPost.title}</h1>
                    <p>{heroPost.excerpt}</p>
                    <div className="post-meta-line">
                      <span>✍️ {heroPost.author}</span>
                      <span>•</span>
                      <span>📅 {new Date(heroPost.published_at || Date.now()).toLocaleDateString('hi-IN')}</span>
                    </div>
                  </div>
                </Link>

                {/* HOT STORIES COLUMN */}
                {hotPosts.length > 0 && (
                  <div className="hot-stories-list">
                    <div className="section-title-box" style={{ marginBottom: '14px' }}>
                      <h2 style={{ fontSize: '18px' }}>🔥 ट्रेंडिंग खबरें</h2>
                    </div>
                    {hotPosts.map((p) => (
                      <Link href={`/posts/${p.slug}`} className="hot-story-item" key={p.id || p.slug}>
                        <div className="hot-story-thumb" style={{ background: '#f8fafc' }}>
                          <img
                            src={getPostImage(p)}
                            alt={p.title}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: isFullCover(p) ? 'cover' : 'contain',
                              padding: isFullCover(p) ? '0' : '8px'
                            }}
                          />
                        </div>
                        <div className="hot-story-info">
                          <h3>{p.title}</h3>
                          <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>
                            {p.category}
                          </span>
                        </div>
                      </Link>
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
              {mainPosts.map((p) => (
                <Link href={`/posts/${p.slug}`} className="post-card" key={p.id || p.slug}>
                  <div className="post-card-image" style={{ background: '#f8fafc' }}>
                    <img
                      src={getPostImage(p)}
                      alt={p.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: isFullCover(p) ? 'cover' : 'contain',
                        padding: isFullCover(p) ? '0' : '16px'
                      }}
                    />
                    <span className="cat-badge">{p.category}</span>
                  </div>
                  <div className="post-card-content">
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    <div className="post-meta-line">
                      <span>{new Date(p.published_at || Date.now()).toLocaleDateString('hi-IN')}</span>
                      <span>•</span>
                      <span>{p.author}</span>
                    </div>
                  </div>
                </Link>
              ))}
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
