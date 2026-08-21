import Link from 'next/link';
import { getPublishedPosts } from '@/lib/db';
import AdSense from '@/components/AdSense';

const categories = [
  'आज का तंज',
  'राष्ट्रीय',
  'राजस्थान',
  'राजनीति',
  'समाज',
  'विश्लेषण',
  'Data Story',
  'Editorial',
  'Fact Check',
  'नागरिक पत्रकारिता',
  'Videos'
];

export default async function Home() {
  const posts = await getPublishedPosts(15);
  const heroPost = posts[0];
  const hotPosts = posts.slice(1, 4);
  const mainPosts = posts.slice(4);

  return (
    <main className="page-container">
      <div className="container">
        <div className="main-layout">
          {/* MAIN NEWS FEED */}
          <section className="feed-section">
            {/* HERO SECTION */}
            {heroPost && (
              <div className="hero-grid">
                <Link href={`/posts/${heroPost.slug}`} className="main-lead-card">
                  <div className="lead-image-box">
                    <img
                      src={
                        heroPost.featured_image ||
                        'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80'
                      }
                      alt={heroPost.title}
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
                <div className="hot-stories-list">
                  <div className="section-title-box" style={{ marginBottom: '14px' }}>
                    <h2 style={{ fontSize: '18px' }}>🔥 ट्रेंडिंग खबरें</h2>
                  </div>
                  {hotPosts.map((p) => (
                    <Link href={`/posts/${p.slug}`} className="hot-story-item" key={p.id}>
                      <div className="hot-story-thumb">
                        <img
                          src={
                            p.featured_image ||
                            'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&q=80'
                          }
                          alt={p.title}
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
              </div>
            )}

            {/* SARCASM SPOTLIGHT BOX */}
            <div className="spotlight-card">
              <div className="spotlight-header">
                <span>🎭 आज का तंज (Satire Spotlight)</span>
              </div>
              <blockquote>
                "खबरों के बीच का तंज ही वह आईना है, जिसमें राजनीति की असली सूरत साफ दिखाई देती है।"
              </blockquote>
              <p style={{ fontSize: '12px', opacity: 0.8 }}>— तंजनामा संपादकीय</p>
            </div>

            {/* LATEST POSTS GRID */}
            <div className="section-title-box">
              <h2>ताज़ा लेख एवं विश्लेषण</h2>
              <span>नवीनतम अपडेट</span>
            </div>

            <div className="posts-grid">
              {mainPosts.map((p) => (
                <Link href={`/posts/${p.slug}`} className="post-card" key={p.id}>
                  <div className="post-card-image">
                    <img
                      src={
                        p.featured_image ||
                        'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80'
                      }
                      alt={p.title}
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

            {/* IN-FEED ADSENSE PLACEMENT */}
            <AdSense slot="in-feed-home" format="auto" />
          </section>

          {/* SIDEBAR */}
          <aside className="sidebar">
            {/* SIDEBAR ADSENSE WIDGET */}
            <div className="sidebar-widget">
              <AdSense slot="sidebar-home" format="auto" />
            </div>

            {/* POPULAR POSTS WIDGET */}
            <div className="sidebar-widget">
              <h3 className="widget-title">📌 सर्वाधिक पढ़े गए लेख</h3>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {posts.slice(0, 5).map((p, i) => (
                  <Link href={`/posts/${p.slug}`} className="popular-item" key={p.id}>
                    <span className="popular-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="popular-text">{p.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CATEGORIES WIDGET */}
            <div className="sidebar-widget">
              <h3 className="widget-title">🏷️ विषय व श्रेणियां</h3>
              <div className="cat-pills">
                {categories.map((c) => (
                  <Link key={c} href={`/category/${encodeURIComponent(c)}`} className="cat-pill">
                    {c}
                  </Link>
                ))}
              </div>
            </div>

            {/* NEWSLETTER SUBSCRIPTION WIDGET */}
            <div className="sidebar-widget newsletter-box">
              <h3 className="widget-title">📧 Tanjnama न्यूज़लेटर</h3>
              <p>दैनिक मुख्य खबरें और आज का तंज सीधे अपने इनबॉक्स में पाएं।</p>
              <form className="newsletter-form" action="#" method="post">
                <input type="email" placeholder="अपना ईमेल दर्ज करें..." required />
                <button type="submit">सब्सक्राइब करें</button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}