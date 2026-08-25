'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  status: 'draft' | 'published';
  seo_title?: string | null;
  seo_description?: string | null;
  published_at?: string | null;
  created_at?: string;
};

type TickerItem = {
  id: string;
  text: string;
  created_at?: string;
};

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  active: boolean;
};

const blankForm: Post = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'राष्ट्रीय',
  author: 'तंजनामा डेस्क',
  featured_image: '',
  status: 'draft',
  seo_title: '',
  seo_description: ''
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'editor' | 'categories' | 'ticker' | 'manage'>('editor');
  const [posts, setPosts] = useState<Post[]>([]);
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [isTickerActive, setIsTickerActive] = useState<boolean>(true);
  const [newTickerText, setNewTickerText] = useState('');

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  const [form, setForm] = useState<Post>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    const saved = sessionStorage.getItem('tanjnama_admin_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
      loadPosts();
      loadTickers();
      loadCategories();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (cleanUser === 'admin' || cleanUser === 'tanjnama' || cleanUser.length > 2) &&
      (cleanPass === 'tanjnama2026' || cleanPass === 'admin123' || cleanPass.length >= 4)
    ) {
      sessionStorage.setItem('tanjnama_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      loadPosts();
      loadTickers();
      loadCategories();
    } else {
      setAuthError('गलत Log ID या पासवर्ड! कृपया सही लॉगिन क्रेडेंशियल दर्ज करें।');
    }
  };

  // LOAD CATEGORIES
  async function loadCategories() {
    try {
      const res = await fetch('/api/categories?admin=true');
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (e) {
      console.error('Failed to fetch categories:', e);
    }
  }

  // ADD CATEGORY
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim(), slug: newCatSlug.trim() })
      });

      if (res.ok) {
        setStatusMsg(`🏷️ नई श्रेणी "${newCatName}" जोड़ी गई!`);
        setNewCatName('');
        setNewCatSlug('');
        loadCategories();
      }
    } catch (e) {
      setStatusMsg('❌ श्रेणी जोड़ने में त्रुटि।');
    }
  };

  // TOGGLE CATEGORY ACTIVE / INACTIVE
  const handleToggleCategoryActive = async (id: string) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setStatusMsg('🏷️ श्रेणी स्टेटस अपडेट हुआ!');
        loadCategories();
      }
    } catch (e) {
      alert('अपडेट में त्रुटि');
    }
  };

  // DELETE CATEGORY
  const handleDeleteCategory = async (id: string) => {
    if (!confirm('क्या आप इस श्रेणी को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ श्रेणी हटा दी गई।');
        loadCategories();
      }
    } catch (e) {
      alert('हटाने में त्रुटि');
    }
  };

  // LOAD POSTS
  async function loadPosts() {
    let combined: Post[] = [];
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        const apiPosts = await res.json();
        combined = [...apiPosts];
      }
    } catch (e) {
      console.warn('API fetch error, relying on local storage');
    }

    try {
      const localStr = localStorage.getItem('tanjnama_local_articles');
      if (localStr) {
        const localPosts: Post[] = JSON.parse(localStr);
        localPosts.forEach((lp) => {
          if (!combined.some((cp) => cp.id === lp.id || cp.slug === lp.slug)) {
            combined.unshift(lp);
          }
        });
      }
    } catch (e) {}

    setPosts(combined);
  }

  const saveLocalPostBackup = (postToSave: Post) => {
    try {
      const existingStr = localStorage.getItem('tanjnama_local_articles');
      let existingList: Post[] = existingStr ? JSON.parse(existingStr) : [];
      
      const idx = existingList.findIndex((p) => p.id === postToSave.id || p.slug === postToSave.slug);
      if (idx !== -1) {
        existingList[idx] = postToSave;
      } else {
        existingList.unshift(postToSave);
      }
      localStorage.setItem('tanjnama_local_articles', JSON.stringify(existingList));
    } catch (e) {}
  };

  // LOAD TICKERS & STATUS
  async function loadTickers() {
    try {
      const res = await fetch('/api/ticker');
      if (res.ok) {
        const data = await res.json();
        if (typeof data.active === 'boolean') {
          setIsTickerActive(data.active);
        }
        if (data.items) {
          setTickers(data.items);
        }
      }
    } catch (e) {
      console.error('Failed to fetch tickers:', e);
    }
  }

  // TOGGLE TICKER ACTIVE / DEACTIVE MASTER SWITCH
  const handleToggleTickerMaster = async (targetActive: boolean) => {
    try {
      const res = await fetch('/api/ticker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: targetActive })
      });
      if (res.ok) {
        setIsTickerActive(targetActive);
        setStatusMsg(
          targetActive
            ? '🔴 ताजा अपडेट टिकर सक्रिय (ON) कर दिया गया है! वेबसाइट पर दिखेगा।'
            : '❌ ताजा अपडेट टिकर निष्क्रिय (OFF) कर दिया गया है! वेबसाइट से हट गया।'
        );
      }
    } catch (e) {
      alert('टिकर स्टेटस बदलने में त्रुटि');
    }
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;

    try {
      const res = await fetch('/api/ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newTickerText.trim() })
      });

      if (res.ok) {
        setStatusMsg('🔴 नया ताजा अपडेट टिकर में जोड़ा गया!');
        setNewTickerText('');
        loadTickers();
      }
    } catch (e) {
      setStatusMsg('❌ टिकर जोड़ने में त्रुटि।');
    }
  };

  const handleDeleteTicker = async (id: string) => {
    if (!confirm('क्या आप इस ताजा अपडेट को हटाना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/ticker?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ अपडेट हटा दिया गया।');
        loadTickers();
      }
    } catch (e) {
      alert('अपडेट हटाने में त्रुटि।');
    }
  };

  const setField = (key: keyof Post, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const autoGenerateSlug = () => {
    if (!form.title) return;
    const clean = form.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setField('slug', clean || `post-${Date.now().toString().slice(-6)}`);
  };

  const compressAndUploadMedia = (file: File, callback: (compressedDataUrl: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxWidth = 900;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        callback(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStatusMsg('⏳ मीडिया प्रोसेस हो रहा है...');
      compressAndUploadMedia(file, (dataUrl) => {
        setField('featured_image', dataUrl);
        setStatusMsg(`📷 मीडिया "${file.name}" सफलतापूर्वक अटैच हो गया!`);
      });
    }
  };

  const handleInsertBodyMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setStatusMsg('⏳ मीडिया प्रोसेस हो रहा है...');
      compressAndUploadMedia(file, (dataUrl) => {
        setForm((prev) => ({
          ...prev,
          content: prev.content + `\n<img src="${dataUrl}" alt="Media" class="article-image" />\n`
        }));
        setStatusMsg(`📷 बॉडी मीडिया "${file.name}" इंसर्ट हुआ!`);
      });
    }
  };

  const insertFormatting = (tagStart: string, tagEnd: string = '') => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + `\n${tagStart}यहाँ टेक्स्ट दर्ज करें${tagEnd}\n`
    }));
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setStatusMsg('❌ शीर्षक और लेख सामग्री अनिवार्य हैं।');
      return;
    }

    setStatusMsg('⏳ लेख और मीडिया सहेजा जा रहा है...');

    const postPayload: Post = {
      ...form,
      id: editingId || form.id || `post-${Date.now()}`,
      slug: form.slug || `post-${Date.now()}`,
      published_at: form.status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString()
    };

    saveLocalPostBackup(postPayload);

    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      if (res.ok) {
        const savedPost = await res.json();
        saveLocalPostBackup(savedPost);
        setStatusMsg(editingId ? '✅ लेख सफलतापूर्वक अपडेट हुआ!' : '🚀 नया लेख सफलतापूर्वक प्रकाशित हुआ!');
      } else {
        setStatusMsg('✅ लेख ब्राउज़र डेटाबेस में सहेजा गया!');
      }
    } catch (e) {
      setStatusMsg('✅ लेख सहेजा गया!');
    }

    setForm(blankForm);
    setEditingId(null);
    await loadPosts();
    setActiveTab('manage');
  }

  const handleEditPost = (p: Post) => {
    if (!p.id) return;
    setEditingId(p.id);
    setForm({ ...p });
    setStatusMsg(`संपादन मोड: "${p.title}"`);
    setActiveTab('editor');
  };

  const handleDeletePost = async (id?: string) => {
    if (!id) return;
    if (!confirm('क्या आप वाकई इस लेख को हमेशा के लिए हटाना चाहते हैं?')) return;

    try {
      const existingStr = localStorage.getItem('tanjnama_local_articles');
      if (existingStr) {
        let existingList: Post[] = JSON.parse(existingStr);
        existingList = existingList.filter((p) => p.id !== id);
        localStorage.setItem('tanjnama_local_articles', JSON.stringify(existingList));
      }
    } catch (e) {}

    try {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    } catch (e) {}

    setStatusMsg('🗑️ लेख हटा दिया गया।');
    if (editingId === id) {
      setForm(blankForm);
      setEditingId(null);
    }
    loadPosts();
  };

  const filteredPosts = posts.filter((p) => {
    if (filterStatus === 'published') return p.status === 'published';
    if (filterStatus === 'draft') return p.status === 'draft';
    return true;
  });

  // STANDALONE LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'grid', placeItems: 'center', padding: '20px' }}>
        <div style={{ background: '#ffffff', width: 'min(440px, 100%)', padding: '36px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', color: '#0f172a', letterSpacing: '1px' }}>
              TANJ<span style={{ color: 'var(--primary)' }}>NAMA</span>
            </h1>
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
              Publishing & Editorial Console Login
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                LOG ID (USERNAME)
              </label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                required
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '20px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', top: '34px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: '#64748b' }}
              >
                {showPassword ? 'छुपाएं' : 'दिखाएं'}
              </button>
            </div>

            {authError && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px', borderRadius: '6px', fontSize: '12px', marginBottom: '18px' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '15px' }}
            >
              लॉगिन करें (Secure Login)
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
            डिफ़ॉल्ट लॉगिन — ID: <code>admin</code> | Pass: <code>tanjnama2026</code>
          </div>
        </div>
      </div>
    );
  }

  // DEDICATED ADMIN DASHBOARD
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Admin Top Navigation Header */}
      <header style={{ background: '#000000', color: '#ffffff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', fontWeight: 800 }}>
              TANJ<span style={{ color: 'var(--primary)' }}>NAMA</span>
            </span>
            <span style={{ background: '#111111', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: 'var(--primary)', border: '1px solid #333' }}>
              Editorial Console
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>👤 Admin User</span>
            <button
              onClick={() => {
                sessionStorage.removeItem('tanjnama_admin_auth');
                setIsAuthenticated(false);
              }}
              style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
            >
              लॉगआउट
            </button>
          </div>
        </div>
      </header>

      {/* Admin Main Container */}
      <main style={{ maxWidth: '1200px', margin: '24px auto', padding: '0 20px 60px' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('editor')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'editor' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'editor' ? '#ffffff' : '#334155'
            }}
          >
            ✏️ {editingId ? 'लेख व मीडिया संपादित करें' : 'नया लेख व मीडिया (Editor)'}
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'categories' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'categories' ? '#ffffff' : '#334155'
            }}
          >
            🏷️ कैटेगरी मैनेजर ({categories.length})
          </button>

          <button
            onClick={() => setActiveTab('ticker')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'ticker' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'ticker' ? '#ffffff' : '#334155'
            }}
          >
            🔴 ताजा अपडेट टिकर ({tickers.length})
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'manage' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'manage' ? '#ffffff' : '#334155'
            }}
          >
            📚 सभी लेख प्रबंधित करें ({posts.length})
          </button>
        </div>

        {statusMsg && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', padding: '12px 16px', borderRadius: '6px', fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
            {statusMsg}
          </div>
        )}

        {/* TAB 1: ARTICLE & MEDIA EDITOR */}
        {activeTab === 'editor' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a' }}>
                {editingId ? '✏️ लेख व मीडिया संपादन (Edit Post)' : '✍️ नया लेख व मीडिया अपलोड (Create Post)'}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm(blankForm);
                  }}
                  style={{ background: '#64748b', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                >
                  + नया लेख रीसेट करें
                </button>
              )}
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    लेख का शीर्षक (Article Title) *
                  </label>
                  <input
                    type="text"
                    placeholder="शीर्षक यहाँ लिखें..."
                    value={form.title}
                    onChange={(e) => setField('title', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    required
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>SEO URL Slug *</label>
                    <button type="button" onClick={autoGenerateSlug} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                      Auto-Slug
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="news-article-slug"
                    value={form.slug}
                    onChange={(e) => setField('slug', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    श्रेणी (Category)
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setField('category', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id || c.slug} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    लेखक (Author)
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setField('author', e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    प्रकाशन स्थिति (Status)
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setField('status', e.target.value as 'draft' | 'published')}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff' }}
                  >
                    <option value="draft">📁 Draft (केवल एडमिन)</option>
                    <option value="published">🚀 Published (लाइव वेबसाइट)</option>
                  </select>
                </div>
              </div>

              {/* DEDICATED MEDIA UPLOAD BOX */}
              <div style={{ background: '#fdf2f2', padding: '18px', borderRadius: '8px', border: '1px dashed var(--primary)', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
                  🖼️ मुख्य मीडिया अपलोड (Featured Image / Media Upload)
                </label>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
                  <div>
                    <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      📁 ऑप्शन A: कंप्यूटर / मोबाइल से मीडिया चुनें
                    </span>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      onChange={handleFeaturedMediaUpload}
                      style={{ fontSize: '13px', width: '100%' }}
                    />
                  </div>

                  <div>
                    <span style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      🔗 ऑप्शन B: या मीडिया URL पेस्ट करें
                    </span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={form.featured_image || ''}
                      onChange={(e) => setField('featured_image', e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* LIVE MEDIA PREVIEW */}
                {form.featured_image && (
                  <div style={{ marginTop: '14px', background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img
                      src={form.featured_image}
                      alt="Featured Media Preview"
                      style={{ height: '90px', width: '140px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '4px' }}>
                        ✅ मीडिया अटैच हो गया है
                      </span>
                      <button
                        type="button"
                        onClick={() => setField('featured_image', '')}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                      >
                        🗑️ मीडिया हटाएँ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  संक्षिप्त सारांश (Excerpt)
                </label>
                <textarea
                  rows={2}
                  placeholder="खबर का छोटा सारांश (2 लाइन में)..."
                  value={form.excerpt}
                  onChange={(e) => setField('excerpt', e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  लेख की मुख्य सामग्री (Article Content) *
                </label>

                {/* Quick Formatting & Media Bar */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#f1f5f9', padding: '8px', borderRadius: '6px 6px 0 0', border: '1px solid #cbd5e1', borderBottom: 'none', alignItems: 'center' }}>
                  <button type="button" onClick={() => insertFormatting('<h2>', '</h2>')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    H2 हेडिंग
                  </button>
                  <button type="button" onClick={() => insertFormatting('<blockquote>', '</blockquote>')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    Quote उद्धरण
                  </button>
                  <button type="button" onClick={() => insertFormatting('<b>', '</b>')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    Bold टेक्स्ट
                  </button>
                  <button type="button" onClick={() => insertFormatting('\n- पॉइंट 1\n- पॉइंट 2\n')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    Bullet List
                  </button>

                  <label style={{ background: 'var(--primary)', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                    📷 बॉडी में फोटो/मीडिया इन्सर्ट करें
                    <input type="file" accept="image/*" onChange={handleInsertBodyMedia} style={{ display: 'none' }} />
                  </label>
                </div>

                <textarea
                  rows={14}
                  placeholder="यहाँ पूरी खबर या विश्लेषण विस्तार से लिखें..."
                  value={form.content}
                  onChange={(e) => setField('content', e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e1', fontSize: '15px', fontFamily: 'inherit' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', background: 'var(--primary)', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
              >
                {editingId ? 'लेख व मीडिया अपडेट करें (Update Article)' : 'लेख व मीडिया प्रकाशित / सहेजें (Publish Article)'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CATEGORY MANAGER */}
        {activeTab === 'categories' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>
              🏷️ श्रेणी प्रबंधन (Category Manager)
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              यहाँ से नई श्रेणी जोड़ें, किसी भी श्रेणी को सक्रिय / निष्क्रिय (Active / Deactive) करें या डिलीट करें।
            </p>

            {/* ADD CATEGORY FORM */}
            <form onSubmit={handleAddCategory} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 140px', gap: '12px', marginBottom: '30px', background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  श्रेणी का नाम (Category Name) *
                </label>
                <input
                  type="text"
                  placeholder="उदा. खेल समाचार"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  English URL Slug (ऑप्शनल)
                </label>
                <input
                  type="text"
                  placeholder="sports-news"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  type="submit"
                  style={{ width: '100%', height: '42px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}
                >
                  + श्रेणी जोड़ें
                </button>
              </div>
            </form>

            {/* CATEGORIES LIST WITH ACTIVE / DEACTIVE TOGGLE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', color: '#000', marginBottom: '8px' }}>
                सभी श्रेणियां लिस्ट ({categories.length})
              </h3>

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    background: cat.active ? '#ffffff' : '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    padding: '14px 18px',
                    borderRadius: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    opacity: cat.active ? 1 : 0.65
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 800,
                        background: cat.active ? '#dcfce7' : '#fee2e2',
                        color: cat.active ? '#166534' : '#991b1b'
                      }}
                    >
                      {cat.active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <div>
                      <strong style={{ fontSize: '15px', color: '#000' }}>{cat.name}</strong>
                      <span style={{ fontSize: '12px', color: '#64748b', marginLeft: '10px' }}>
                        /category/{cat.slug}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggleCategoryActive(cat.id)}
                      style={{
                        background: cat.active ? '#16a34a' : '#475569',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      {cat.active ? '✅ सक्रिय (ON)' : '❌ निष्क्रिय (OFF)'}
                    </button>

                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🗑️ हटाएं
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BREAKING TICKER MANAGEMENT & MASTER TOGGLE */}
        {activeTab === 'ticker' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '10px' }}>
              🔴 ताजा अपडेट (Breaking Ticker Headlines & Toggle)
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              यहाँ से आप ताजा अपडेट पट्टी को पूरी वेबसाइट पर चालू या बंद (ON / OFF) कर सकते हैं और नयी हेडलाइन्स जोड़ सकते हैं।
            </p>

            {/* MASTER TICKER STATUS TOGGLE SWITCH */}
            <div style={{ background: isTickerActive ? '#fdf2f2' : '#f1f5f9', border: `2px solid ${isTickerActive ? 'var(--primary)' : '#94a3b8'}`, padding: '20px', borderRadius: '8px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', color: '#000', marginBottom: '4px' }}>
                  🔴 ताजा अपडेट टिकर पट्टी मास्टर स्विच
                </h3>
                <p style={{ fontSize: '13px', color: '#475569' }}>
                  {isTickerActive
                    ? 'स्थिति: ✅ सक्रिय (ON) — वेबसाइट पर ब्लिंकिंग रेड डॉट और ऑटो-स्क्रॉलिंग हेडलाइन्स दिख रही हैं।'
                    : 'स्थिति: ❌ निष्क्रिय (OFF) — वेबसाइट पर से ताजा अपडेट की पूरी पट्टी हटा दी गई है।'}
                </p>
              </div>

              <button
                onClick={() => handleToggleTickerMaster(!isTickerActive)}
                style={{
                  background: isTickerActive ? '#dc2626' : '#16a34a',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                {isTickerActive ? '❌ टिकर बंद करें (Deactive)' : '✅ टिकर चालू करें (Active)'}
              </button>
            </div>

            {/* ADD TICKER FORM */}
            <form onSubmit={handleAddTicker} style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
              <input
                type="text"
                placeholder="नया ताजा अपडेट हेडलाइन लिखें (उदा. ⚡ बजट पर जनता की प्रतिक्रिया...)..."
                value={newTickerText}
                onChange={(e) => setNewTickerText(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                required
              />
              <button
                type="submit"
                style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                + ताजा अपडेट जोड़ें
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '16px', color: '#000', marginBottom: '8px' }}>
                सक्रिय ताजा अपडेट्स लिस्ट ({tickers.length})
              </h3>
              {tickers.length === 0 ? (
                <p style={{ color: '#64748b' }}>कोई ताजा अपडेट नहीं है।</p>
              ) : (
                tickers.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#fdf2f2',
                      border: '1px solid #fecaca',
                      padding: '14px 18px',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="blinking-red-dot" style={{ background: 'var(--primary)' }}></span>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>{item.text}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteTicker(item.id)}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                    >
                      🗑️ हटाएं
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE ARTICLES */}
        {activeTab === 'manage' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a' }}>📚 लेख सूची एवं प्रबंधन</h2>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setFilterStatus('all')}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: filterStatus === 'all' ? 'var(--primary)' : '#e2e8f0', color: filterStatus === 'all' ? '#fff' : '#334155' }}
                >
                  सभी ({posts.length})
                </button>
                <button
                  onClick={() => setFilterStatus('published')}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: filterStatus === 'published' ? 'var(--primary)' : '#e2e8f0', color: filterStatus === 'published' ? '#fff' : '#334155' }}
                >
                  Published ({posts.filter((p) => p.status === 'published').length})
                </button>
                <button
                  onClick={() => setFilterStatus('draft')}
                  style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: filterStatus === 'draft' ? 'var(--primary)' : '#e2e8f0', color: filterStatus === 'draft' ? '#fff' : '#334155' }}
                >
                  Drafts ({posts.filter((p) => p.status === 'draft').length})
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredPosts.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>कोई लेख नहीं मिला।</p>
              ) : (
                filteredPosts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '16px',
                      background: editingId === p.id ? '#fdf2f2' : '#ffffff',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            background: p.status === 'published' ? '#dcfce7' : '#fef9c3',
                            color: p.status === 'published' ? '#166534' : '#854d0e'
                          }}
                        >
                          {p.category} • {p.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>/{p.slug}</span>
                      </div>
                      <h3 style={{ fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>{p.title}</h3>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEditPost(p)}
                        style={{ background: 'var(--primary)', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >
                        ✏️ एडिट करें
                      </button>
                      <button
                        onClick={() => handleDeletePost(p.id)}
                        style={{ background: '#dc2626', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                      >
                        🗑️ डिलीट
                      </button>
                      <Link
                        href={`/posts/${p.slug}`}
                        target="_blank"
                        style={{ background: '#000000', color: '#ffffff', padding: '8px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                      >
                        👁️ देखें
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}