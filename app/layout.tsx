import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  metadataBase: new URL('https://thetanjnama-omega.vercel.app'),
  title: {
    default: 'TANJNAMA | खबर, तंज और विश्लेषण',
    template: '%s | TANJNAMA'
  },
  description:
    'TANJNAMA (तंजनामा) — खबरों, तंज, निष्पक्ष विश्लेषण, डाटा स्टोरी और नागरिक पत्रकारिता का स्वतंत्र डिजिटल समाचार मंच।',
  keywords: [
    'TANJNAMA',
    'तंजनामा',
    'Hindi News',
    'Satire News',
    'तंज',
    'खबरें',
    'राजस्थान समाचार',
    'राजनीति',
    'विश्लेषण'
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: 'TANJNAMA — खबरों के बीच से निकला हुआ तंज',
    description: 'स्वतंत्र डिजिटल समाचार, तंज और निष्पक्ष विश्लेषण मंच।',
    type: 'website',
    url: 'https://thetanjnama-omega.vercel.app'
  }
};

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          ></script>
        )}
      </head>
      <body>
        <div id="outer-wrapper">
          <Header />

          <div className="breaking-ticker">
            <div className="container breaking-inner">
              <span className="ticker-badge">🔴 ताजा अपडेट</span>
              <span className="ticker-text">
                TANJNAMA डिजिटल मंच पर आपका स्वागत है — स्वतंत्र पत्रकारिता और निष्पक्ष तंज का सही ठिकाना।
              </span>
            </div>
          </div>

          {children}

          {/* Global Footer */}
          <footer className="site-footer">
            <div className="container footer-grid">
              <div className="footer-brand">
                <h2 className="footer-logo">
                  TANJ<span className="brand-accent">NAMA</span>
                </h2>
                <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#94a3b8' }}>
                  खबरों के बीच से निकला हुआ तीखा तंज और निष्पक्ष विश्लेषण। हम बिना किसी पक्षपात के लोकतंत्र,
                  समाज और राजनीति की सच्ची तस्वीर प्रस्तुत करने के लिए प्रतिबद्ध हैं।
                </p>
              </div>

              <div className="footer-col">
                <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>मुख्य श्रेणियां</h3>
                <ul className="footer-links">
                  {categories.slice(0, 6).map((c) => (
                    <li key={c}>
                      <Link href={`/category/${encodeURIComponent(c)}`}>{c}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col">
                <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>महत्वपूर्ण लिंक्स</h3>
                <ul className="footer-links">
                  <li>
                    <Link href="/about">हमारे बारे में (About Us)</Link>
                  </li>
                  <li>
                    <Link href="/contact">संपर्क करें (Contact Us)</Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy">गोपनीयता नीति (Privacy Policy)</Link>
                  </li>
                  <li>
                    <Link href="/disclaimer">अस्वीकरण (Disclaimer)</Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="footer-bottom">
              <div className="container footer-bottom-inner">
                <p>© {new Date().getFullYear()} TANJNAMA Media (तंजनामा). सर्वाधिकार सुरक्षित।</p>
                <p style={{ color: '#64748b' }}>Independent Journalism Platform</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}