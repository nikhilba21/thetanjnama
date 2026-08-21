import Link from 'next/link';
import { searchPosts } from '@/lib/db';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || '';
  const results = query ? await searchPosts(query) : [];

  return (
    <main className="page-container">
      <div className="container">
        <div className="section-title-box">
          <h2>🔍 खोज परिणाम: "{query}"</h2>
          <span>{results.length} लेख मिले</span>
        </div>

        {results.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '4px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '16px', color: '#656565' }}>
              "{query}" से सम्बंधित कोई लेख नहीं मिला। कृपया अन्य शब्द खोजें।
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {results.map((p) => (
              <Link href={`/posts/${p.slug}`} className="post-card" key={p.id}>
                <div className="post-card-image">
                  <img
                    src={
                      p.featured_image ||
                      'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=600&q=80'
                    }
                    alt={p.title}
                  />
                  <span className="cat-badge">{p.category}</span>
                </div>
                <div className="post-card-content">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div className="post-meta-line">
                    <span>📅 {new Date(p.published_at || Date.now()).toLocaleDateString('hi-IN')}</span>
                    <span>•</span>
                    <span>{p.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
