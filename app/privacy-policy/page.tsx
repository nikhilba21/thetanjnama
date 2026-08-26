import { getPageBySlug } from '@/lib/pages';

export const metadata = {
  title: 'गोपनीयता नीति (Privacy Policy) | TANJNAMA',
  description: 'TANJNAMA गोपनीयता नीति और डेटा सुरक्षा जानकारी।'
};

export default function PrivacyPolicyPage() {
  const page = getPageBySlug('privacy-policy');

  return (
    <main className="page-container">
      <div className="container">
        <article className="article-container">
          <h1 className="article-title">{page?.title || 'गोपनीयता नीति (Privacy Policy)'}</h1>
          <div
            className="article-body-text"
            dangerouslySetInnerHTML={{
              __html:
                page?.content ||
                `<p>TANJNAMA Privacy Policy for user data protection.</p>`
            }}
          />
        </article>
      </div>
    </main>
  );
}
