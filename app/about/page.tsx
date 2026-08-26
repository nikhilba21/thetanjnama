import { getPageBySlug } from '@/lib/pages';

export const metadata = {
  title: 'हमारे बारे में (About Us) | TANJNAMA',
  description: 'तंजनामा डिजिटल मीडिया मंच के बारे में जानें। सोच पर तंज, सच के साथ।'
};

export default function AboutPage() {
  const page = getPageBySlug('about');

  return (
    <main className="page-container">
      <div className="container">
        <article className="article-container">
          <h1 className="article-title">{page?.title || 'हमारे बारे में (About Us)'}</h1>
          <div
            className="article-body-text"
            dangerouslySetInnerHTML={{
              __html:
                page?.content ||
                `<p>TANJNAMA (तंजनामा) — सोच पर तंज, सच के साथ। स्वतंत्र डिजिटल मीडिया मंच।</p>`
            }}
          />
        </article>
      </div>
    </main>
  );
}
