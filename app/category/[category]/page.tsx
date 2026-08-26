import type { Metadata } from 'next';
import Link from 'next/link';
import { getPostsByCategory } from '@/lib/db';
import { getCategoryNameBySlug } from '@/lib/categories';
import AajKaSawalWidget from '@/components/AajKaSawalWidget';

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const categoryName = getCategoryNameBySlug(categorySlug);
  const pageUrl = `https://thetanjnama-omega.vercel.app/category/${categorySlug}`;

  return {
    title: `${categoryName} समाचार एवं विश्लेषण | TANJNAMA`,
    description: `TANJNAMA पर ${categoryName} श्रेणी की ताजा खबरें, निष्पक्ष विश्लेषण और तीखा तंज पढ़ें।`,
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: `${categoryName} — TANJNAMA`,
      description: `${categoryName} की ताजा खबरें और विश्लेषण।`,
      url: pageUrl
    }
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;
  const categoryName = getCategoryNameBySlug(categorySlug);
  const posts = await getPostsByCategory(categoryName);

  return (
    <main className="page-container">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          <Link href="/" style={{ color: 'var(--primary)', fontWeight: 600 }}>होम</Link> / <span>{categoryName}</span>
        </div>

        <div className="layout-grid">
          {/* Main Category Feed */}
          <div className="feed-main">
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <h1 className="section-title" style={{ fontSize: '26px' }}>
                {categoryName}
              </h1>
              <span style={{ fontSize: '13px', color: '#64748b' }}>
                ({posts.length} खबरें)
              </span>
            </div>

            {posts.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '16px', color: '#64748b' }}>
                  इस श्रेणी में अभी कोई खबर प्रकाशित नहीं हुई है।
                </p>
                <Link href="/" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px' }}>
                  होमपेज पर वापस जाएं
                </Link>
              </div>
            ) : (
              <div className="article-feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {posts.map((p) => (
                  <article key={p.id} className="card flex-row-card" style={{ display: 'flex', gap: '20px', padding: '16px' }}>
                    {p.featured_image && (
                      <Link href={`/posts/${p.slug}`} style={{ flexShrink: 0, width: '220px' }}>
                        <img
                          src={p.featured_image}
                          alt={p.title}
                          style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }}
                        />
                      </Link>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span className="card-tag" style={{ width: 'fit-content', marginBottom: '6px' }}>
                        {p.category}
                      </span>
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
    </main>
  );
}