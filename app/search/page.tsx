import Link from 'next/link';
import { searchPosts } from '@/lib/db';
import { getYouTubeThumbnailUrl } from '@/lib/video';
import { formatDateSafe } from '@/lib/date';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const query = (await searchParams).q || '';
  const results = query ? await searchPosts(query) : [];

  const getPostImage = (p: any) => {
    if (p.featured_image && p.featured_image.trim().length > 0 && !p.featured_image.includes('/logo.png') && !p.featured_image.includes('/logo.webp')) {
      return p.featured_image;
    }
    if (p.video_url && p.video_url.trim().length > 0) {
      const ytThumb = getYouTubeThumbnailUrl(p.video_url);
      if (ytThumb) return ytThumb;
    }
    return p.featured_image || '/default-cover.webp';
  };

  const isFullCover = (p: any) => {
    const img = getPostImage(p);
    return img !== '/default-cover.webp' && !img.endsWith('/default-cover.webp');
  };

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
                        background: '#f8fafc',
                        padding: isFullCover(p) ? '0' : '10px'
                      }}
                    />
                  <span className="cat-badge">{p.category}</span>
                </div>
                <div className="post-card-content">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <div className="post-meta-line">
                    <span>📅 {formatDateSafe(p.published_at)}</span>
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
