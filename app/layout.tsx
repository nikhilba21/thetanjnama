import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://thetanjnama.com'),
  title: { default: 'Tanjnama | खबर, तंज और विश्लेषण', template: '%s | Tanjnama' },
  description: 'Tanjnama — खबरों, तंज, विश्लेषण, डेटा स्टोरी और नागरिक पत्रकारिता का स्वतंत्र डिजिटल मंच।',
  robots: { index: true, follow: true },
  openGraph: { title: 'Tanjnama', description: 'खबर, तंज और विश्लेषण', type: 'website' }
};

const categories = ['आज का तंज','राष्ट्रीय','राजस्थान','राजनीति','समाज','विश्लेषण','Data Story','Editorial','Fact Check','नागरिक पत्रकारिता','Videos'];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="hi"><body>
    <div className="top"><div className="container"><span>बुधवार, 19 अगस्त 2026</span><span>स्वतंत्र खबर • तंज • विश्लेषण</span></div></div>
    <header className="header"><div className="container">
      <div className="header-main"><div><h1 className="brand">Tanj<span>nama</span></h1><div className="tagline">खबरों के बीच से निकला हुआ तंज</div></div><div>🔎</div></div>
      <nav className="nav"><ul>{categories.map(c=><li key={c}><a href="#">{c}</a></li>)}</ul></nav>
    </div></header>
    <div className="breaking"><div className="container"><span className="badge">BREAKING</span><span>ताजा खबरों और महत्वपूर्ण अपडेट के लिए Tanjnama पढ़ते रहें</span></div></div>
    {children}
    <footer className="footer"><div className="container footer-grid"><div><h3>Tanjnama</h3><p>खबरों, तंज, विश्लेषण और नागरिक पत्रकारिता का डिजिटल मंच।</p></div><div><h3>Sections</h3>{categories.slice(0,5).map(c=><a key={c} href="#">{c}</a>)}</div><div><h3>Important</h3><a href="#">About Us</a><a href="#">Contact</a><a href="#">Privacy Policy</a><a href="#">Disclaimer</a></div></div></footer>
  </body></html>
}