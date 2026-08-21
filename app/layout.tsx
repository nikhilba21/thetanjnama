import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header';
import AdSense from '@/components/AdSense';

export const metadata: Metadata = {
  metadataBase: new URL('https://thetanjnama-omega.vercel.app'),
  title: {
    default: 'Tanjnama | तंज, निष्पक्ष खबर और तीखा विश्लेषण',
    template: '%s | Tanjnama'
  },
  description:
    'Tanjnama (तंजनामा) — खबरों, तंज, निष्पक्ष विश्लेषण, डाटा स्टोरी और नागरिक पत्रकारिता का अग्रणी स्वतंत्र डिजिटल समाचार मंच।',
  keywords: [
    'Tanjnama',
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
    title: 'Tanjnama — खबरों के बीच से निकला हुआ तंज',
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
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;800&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Rozha+One&display=swap"
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
        <Header />

        <div className="breaking-ticker">
          <div className="container breaking-inner">
            <span className="ticker-badge">🔴 ताजा अपडेट</span>
            <span className="ticker-text">
              Tanjnama डिजिटल मंच पर आपका स्वागत है — स्वतंत्र पत्रकारिता और निष्पक्ष तंज का सही ठिकाना।
            </span>
          </div>
        </div>

        {children}

        {/* Global Footer */}
        <footer className="site-footer">
          <div className="container footer-grid">
            <div className="footer-brand">
              <h2 className="footer-logo">
                Tanj<span className="brand-accent">nama</span>
              </h2>
              <p className="footer-desc">
                खबरों के बीच से निकला हुआ तीखा तंज और निष्पक्ष विश्लेषण। हम बिना किसी पक्षपात के लोकतंत्र,
                समाज और राजनीति की सच्ची तस्वीर प्रस्तुत करने के लिए प्रतिबद्ध हैं।
              </p>
              <div className="footer-socials">
                <span className="social-badge">Follow Tanjnama</span>
              </div>
            </div>

            <div className="footer-col">
              <h3>मुख्य श्रेणियां</h3>
              <ul className="footer-links">
                {categories.slice(0, 6).map((c) => (
                  <li key={c}>
                    <Link href={`/category/${encodeURIComponent(c)}`}>{c}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3>महत्वपूर्ण लिंक्स</h3>
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
                <li>
                  <Link href="/admin">CMS Admin Login</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="container footer-bottom-inner">
              <p>© {new Date().getFullYear()} Tanjnama Media (तंजनामा). सर्वाधिकार सुरक्षित।</p>
              <p className="footer-credit">Built with Passion for Independent Journalism</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}