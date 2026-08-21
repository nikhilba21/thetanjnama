'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setCurrentDate(new Date().toLocaleDateString('hi-IN', options));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="top-bar">
        <div className="container top-bar-inner">
          <div className="top-date">
            <span className="live-dot"></span>
            <span>{currentDate || 'बुधवार, 19 अगस्त 2026'}</span>
          </div>

          <div className="top-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" title="Facebook">FB</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" title="Twitter">X</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" title="Instagram">IG</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" title="YouTube">YT</a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="main-header">
        <div className="container header-inner">
          <div className="brand-group">
            <button
              className="mobile-toggle"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle Menu"
            >
              ☰ Menu
            </button>
            <Link href="/" className="brand-logo">
              TANJ<span className="brand-accent">NAMA</span>
            </Link>
          </div>

          <div className="header-actions">
            <button className="search-btn" onClick={() => setSearchOpen(true)}>
              🔍 खोजें
            </button>
            <Link href="/admin" className="admin-btn">
              ⚙️ Admin CMS
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="desktop-nav">
          <div className="container">
            <ul className="nav-list">
              <li>
                <Link href="/" className="nav-link home-link">
                  🏠 होम
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/category/${encodeURIComponent(c)}`} className="nav-link">
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileNavOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileNavOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className="brand-logo" style={{ fontSize: '22px' }}>
                TANJ<span className="brand-accent">NAMA</span>
              </span>
              <button onClick={() => setMobileNavOpen(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="/" onClick={() => setMobileNavOpen(false)}>🏠 होम</Link></li>
              {categories.map((c) => (
                <li key={c}>
                  <Link href={`/category/${encodeURIComponent(c)}`} onClick={() => setMobileNavOpen(false)}>
                    {c}
                  </Link>
                </li>
              ))}
              <li style={{ height: '1px', background: '#e2e8f0' }}></li>
              <li><Link href="/about" onClick={() => setMobileNavOpen(false)}>About Us</Link></li>
              <li><Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact Us</Link></li>
              <li><Link href="/privacy-policy" onClick={() => setMobileNavOpen(false)}>Privacy Policy</Link></li>
              <li><Link href="/disclaimer" onClick={() => setMobileNavOpen(false)}>Disclaimer</Link></li>
              <li><Link href="/admin" onClick={() => setMobileNavOpen(false)}>Admin CMS</Link></li>
            </ul>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchOpen && (
        <div className="search-modal-overlay" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="खबरें, तंज या विषय खोजें..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '10px', border: '1px solid #0b87c2', borderRadius: '4px' }}
                autoFocus
              />
              <button type="submit" className="btn-primary">खोजें</button>
            </form>
            <button onClick={() => setSearchOpen(false)} style={{ display: 'block', margin: '14px auto 0', background: 'none', border: 'none', color: '#656565', cursor: 'pointer' }}>
              ✕ बंद करें
            </button>
          </div>
        </div>
      )}
    </>
  );
}
