import { getPublishedPosts } from '@/lib/db';
import { getCategoryNameFromSlug } from '@/lib/categories';
import Link from 'next/link';

export async function generateMetadata({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const rawParam = (await params).category;
  const categoryName = getCategoryNameFromSlug(rawParam) || decodeURIComponent(rawParam);
  return {
    title: `${categoryName} | TANJNAMA`,
    description: `TANJNAMA पर ${categoryName} श्रेणी के सभी नवीनतम समाचार, तंज और निष्पक्ष विश्लेषण पढ़ें।`
  };
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ category: string }>;
}) {
  const rawParam = (await params).category;
  const categoryName = getCategoryNameFromSlug(rawParam) || decodeURIComponent(rawParam);

  const allPosts = await getPublishedPosts(50);
  const filtered = allPosts.filter(
    (p) => p.category.trim().toLowerCase() === categoryName.trim().toLowerCase()
  );

  return (
    <main className="page-container">
      <div className="container">
        <div className="section-title-box">
          <h2>📂 श्रेणी: {categoryName}</h2>
          <span>{filtered.length} लेख प्रकाशित</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: '#ffffff', padding: '40px', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: '15px', color: '#656565' }}>
              इस श्रेणी (<strong>{categoryName}</strong>) में अभी कोई लेख उपलब्ध नहीं है। जल्द ही नये लेख प्रकाशित किए जाएंगे!
            </p>
          </div>
        ) : (
          <div className="posts-grid">
            {filtered.map((p) => (
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