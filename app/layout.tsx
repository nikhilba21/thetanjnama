import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import Header from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import { CATEGORY_LIST } from '@/lib/categories';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tanjnama.com'),
  title: {
    default: 'TANJNAMA | सोच पर तंज, सच के साथ — स्वतंत्र हिंदी समाचार एवं विश्लेषण',
    template: '%s | TANJNAMA'
  },
  description:
    'TANJNAMA (तंजनामा) — सोच पर तंज, सच के साथ। स्वतंत्र खबरों, तीखे तंज, निष्पक्ष राजनीतिक विश्लेषण, डेटा स्टोरी और नागरिक पत्रकारिता का अग्रणी डिजिटल मंच।',
  keywords: [
    'TANJNAMA',
    'तंजनामा',
    'Hindi News',
    'Satire News',
    'तंज',
    'खबरें',
    'राजस्थान समाचार',
    'राजनीति',
    'विश्लेषण',
    'डेटा स्टोरी',
    'नागरिक पत्रकारिता'
  ],
  authors: [{ name: 'TANJNAMA Editorial Team', url: 'https://www.tanjnama.com' }],
  creator: 'TANJNAMA Media',
  publisher: 'TANJNAMA Media Group',
  alternates: {
    canonical: 'https://www.tanjnama.com'
  },
  verification: {
    google: 'Do016rt6M0nMAw7LnXzML-_okC72nLhOSgp6kwZvYxU'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  openGraph: {
    title: 'TANJNAMA — सोच पर तंज, सच के साथ',
    description: 'स्वतंत्र डिजिटल समाचार, तीखा तंज और निष्पक्ष विश्लेषण मंच।',
    type: 'website',
    url: 'https://www.tanjnama.com',
    siteName: 'TANJNAMA',
    locale: 'hi_IN',
    images: [
      {
        url: 'https://www.tanjnama.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'TANJNAMA — सोच पर तंज, सच के साथ'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TANJNAMA — सोच पर तंज, सच के साथ',
    description: 'स्वतंत्र डिजिटल समाचार, तीखा तंज और निष्पक्ष विश्लेषण मंच।',
    images: ['https://www.tanjnama.com/logo.png']
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // JSON-LD Structured Data Schema for Google Search
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsMediaOrganization',
        '@id': 'https://www.tanjnama.com/#organization',
        name: 'TANJNAMA',
        url: 'https://www.tanjnama.com',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.tanjnama.com/logo.png'
        },
        slogan: 'सोच पर तंज, सच के साथ',
        sameAs: [
          'https://facebook.com',
          'https://twitter.com',
          'https://instagram.com',
          'https://youtube.com'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://www.tanjnama.com/#website',
        url: 'https://www.tanjnama.com',
        name: 'TANJNAMA',
        description: 'सोच पर तंज, सच के साथ — स्वतंत्र समाचार एवं विश्लेषण',
        publisher: {
          '@id': 'https://www.tanjnama.com/#organization'
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://www.tanjnama.com/search?q={search_term_string}',
          'query-input': 'required name=search_term_string'
        }
      }
    ]
  };

  return (
    <html lang="hi">
      <head>
        <meta name="google-site-verification" content="Do016rt6M0nMAw7LnXzML-_okC72nLhOSgp6kwZvYxU" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data JSON-LD Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
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

          {/* Auto-scrolling Breaking News Ticker with Blinking Red Dot */}
          <BreakingTicker />

          {children}

          {/* Global Footer */}
          <footer className="site-footer">
            <div className="container footer-grid">
              <div className="footer-brand">
                <img src="/logo.png" alt="TANJNAMA — सोच पर तंज, सच के साथ" className="footer-logo-img" />
                <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#94a3b8', marginTop: '8px' }}>
                  खबरों के बीच से निकला हुआ तीखा तंज और निष्पक्ष विश्लेषण। हम बिना किसी पक्षपात के लोकतंत्र,
                  समाज और राजनीति की सच्ची तस्वीर प्रस्तुत करने के लिए प्रतिबद्ध हैं।
                </p>
              </div>

              <div className="footer-col">
                <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '14px' }}>मुख्य श्रेणियां</h3>
                <ul className="footer-links">
                  {CATEGORY_LIST.slice(0, 6).map((c) => (
                    <li key={c.slug}>
                      <Link href={`/category/${c.slug}`}>{c.name}</Link>
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
                <p style={{ color: '#64748b' }}>सोच पर तंज, सच के साथ</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}