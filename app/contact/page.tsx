import { getPageBySlug } from '@/lib/pages';

export const metadata = {
  title: 'संपर्क करें (Contact Us) | TANJNAMA',
  description: 'तंजनामा मीडिया टीम से संपर्क करें। प्रतिक्रिया और विज्ञापन संबंधी जानकारी।'
};

export default function ContactPage() {
  const page = getPageBySlug('contact');

  return (
    <main className="page-container">
      <div className="container">
        <article className="article-container">
          <h1 className="article-title">{page?.title || 'संपर्क करें (Contact Us)'}</h1>
          <div
            className="article-body-text"
            dangerouslySetInnerHTML={{
              __html:
                page?.content ||
                `<p>तंजनामा टीम से संपर्क करें: editor@tanjnama.com</p>`
            }}
          />
        </article>
      </div>
    </main>
  );
}
