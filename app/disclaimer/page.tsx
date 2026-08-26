import { getPageBySlug } from '@/lib/pages';

export const metadata = {
  title: 'अस्वीकरण (Disclaimer) | TANJNAMA',
  description: 'TANJNAMA अस्वीकरण और वैधानिक सूचना।'
};

export default function DisclaimerPage() {
  const page = getPageBySlug('disclaimer');

  return (
    <main className="page-container">
      <div className="container">
        <article className="article-container">
          <h1 className="article-title">{page?.title || 'अस्वीकरण (Disclaimer)'}</h1>
          <div
            className="article-body-text"
            dangerouslySetInnerHTML={{
              __html:
                page?.content ||
                `<p>TANJNAMA Disclaimer policy and guidelines.</p>`
            }}
          />
        </article>
      </div>
    </main>
  );
}
