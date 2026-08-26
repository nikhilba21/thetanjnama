'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CATEGORY_LIST, CategoryItem } from '@/lib/categories';

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [categories, setCategories] = useState<CategoryItem[]>(CATEGORY_LIST);
  const router = useRouter();

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setCurrentDate(new Date().toLocaleDateString('hi-IN', options));

    // Fetch active categories dynamically
    async function loadActiveCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const list: CategoryItem[] = await res.json();
          if (list && list.length > 0) {
            setCategories(list);
          }
        }
      } catch (e) {
        console.warn('Category fetch error on header');
      }
    }
    loadActiveCategories();
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

      {/* Main Header with Logo AND Navigation Items in ONE SINGLE LINE */}
      <header className="main-header">
        <div className="container header-inner">
          {/* Logo Brand */}
          <div className="brand-group">
            <button
              className="mobile-toggle"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
            <Link href="/">
              <img src="/logo.png" alt="TANJNAMA — सोच पर तंज, सच के साथ" className="brand-logo-img" />
            </Link>
          </div>

          {/* Inline Navigation Menu (Same Line) */}
          <nav className="desktop-inline-nav">
            <ul className="inline-nav-list">
              <li>
                <Link href="/" className="nav-link home-link">
                  🏠 होम
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} className="nav-link">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Search Button */}
          <div className="header-actions">
            <button className="search-btn" onClick={() => setSearchOpen(true)}>
              🔍 खोजें
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileNavOpen && (
        <div className="mobile-drawer-overlay" onClick={() => setMobileNavOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <img src="/logo.png" alt="TANJNAMA" style={{ height: '40px' }} />
              <button onClick={() => setMobileNavOpen(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link href="/" onClick={() => setMobileNavOpen(false)}>🏠 होम</Link></li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} onClick={() => setMobileNavOpen(false)}>
                    {c.name}
                  </Link>
                </li>
              ))}
              <li style={{ height: '1px', background: '#e2e8f0' }}></li>
              <li><Link href="/about" onClick={() => setMobileNavOpen(false)}>About Us</Link></li>
              <li><Link href="/contact" onClick={() => setMobileNavOpen(false)}>Contact Us</Link></li>
              <li><Link href="/privacy-policy" onClick={() => setMobileNavOpen(false)}>Privacy Policy</Link></li>
              <li><Link href="/disclaimer" onClick={() => setMobileNavOpen(false)}>Disclaimer</Link></li>
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
                style={{ flex: 1, padding: '10px', border: '1px solid var(--primary)', borderRadius: '4px' }}
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
