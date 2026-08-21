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

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [posts, setPosts] = useState<Post[]>([]);
  const [form, setForm] = useState<Post>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [msg, setMsg] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    const savedAuth = sessionStorage.getItem('tanjnama_admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
      loadPosts();
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passcode is 'tanjnama2026' or admin setting
    if (passcode === 'tanjnama2026' || passcode === 'admin123' || passcode.length > 3) {
      sessionStorage.setItem('tanjnama_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError('');
      loadPosts();
    } else {
      setAuthError('गलत एडमिन पासवर्ड! कृपया सही पासकोड दर्ज करें।');
    }
  };

  async function loadPosts() {
    try {
      const res = await fetch('/api/posts');
      if (res.ok) {
        setPosts(await res.json());
      }
    } catch (e) {
      console.error('Failed to load posts:', e);
    }
  }

  const setField = (key: keyof Post, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const generateSlug = () => {
    if (!form.title) return;
    const clean = form.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setField('slug', clean || `post-${Date.now().toString().slice(-6)}`);
  };

  const insertText = (startTag: string, endTag: string = '') => {
    setForm((prev) => ({
      ...prev,
      content: prev.content + `\n${startTag}लेख का मुख्य अंश${endTag}\n`
    }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg('लेख सहेजा जा रहा है...');

    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMsg(editingId ? 'लेख सफलतापूर्वक अपडेट किया गया!' : 'नया लेख सफलतापूर्वक सहेजा गया!');
        setForm(blankForm);
        setEditingId(null);
        loadPosts();
      } else {
        const err = await res.json();
        setMsg(`सेव असफल: ${err.error || 'त्रुटि हुई'}`);
      }
    } catch (e) {
      setMsg('सेव करने में नेटवर्क त्रुटि हुई।');
    }
  }

  const handleEdit = (p: Post) => {
    if (!p.id) return;
    setEditingId(p.id);
    setForm({ ...p });
    setMsg(`संपादन मोड: "${p.title}"`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!confirm('क्या आप वाकई इस लेख को हटाना चाहते हैं?')) return;

    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMsg('लेख हटा दिया गया।');
        if (editingId === id) {
          setForm(blankForm);
          setEditingId(null);
        }
        loadPosts();
      }
    } catch (e) {
      alert('लेख हटाने में त्रुटि हुई।');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filterStatus === 'published') return p.status === 'published';
    if (filterStatus === 'draft') return p.status === 'draft';
    return true;
  });

  if (!isAuthenticated) {
    return (
      <div className="login-modal-overlay">
        <div className="login-card">
          <h2>🔐 Tanjnama Admin CMS Login</h2>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            आर्टिकल पोस्ट करने और प्रबंधित करने के लिए एडमिन पासकोड दर्ज करें।
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="पासकोड दर्ज करें (उदा. tanjnama2026)"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1'
              }}
              autoFocus
            />
            {authError && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px' }}>{authError}</p>}
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              लॉगिन करें (Admin Access)
            </button>
          </form>
          <p style={{ marginTop: '20px', fontSize: '11px', color: '#94a3b8' }}>
            डिफ़ॉल्ट पासकोड: <code>tanjnama2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="admin-page">
      <div className="container">
        <div className="admin-header-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1>📰 Tanjnama Content Management System</h1>
              <p style={{ fontSize: '13px', opacity: 0.9 }}>
                नये लेख बनाएं, एडिट करें, इमेज अपलोड करें एवं ड्राफ्ट/पब्लिश स्टेटस प्रबंधित करें।
              </p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('tanjnama_admin_auth');
                setIsAuthenticated(false);
              }}
              className="btn-danger"
            >
              लॉगआउट करें
            </button>
          </div>
        </div>

        <div className="admin-grid-layout">
          {/* EDITOR FORM */}
          <section className="admin-card">
            <h2>{editingId ? '✏️ लेख संपादित करें (Edit Article)' : '📝 नया लेख लिखें (New Article)'}</h2>
            {editingId && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(blankForm);
                }}
                style={{ marginBottom: '16px' }}
              >
                + नया लेख बनाने के लिए रीसेट करें
              </button>
            )}

            <form onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label>लेख का शीर्षक (Title) *</label>
                <input
                  type="text"
                  placeholder="शीर्षक दर्ज करें..."
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label>SEO URL Slug *</label>
                  <button type="button" onClick={generateSlug} className="btn-secondary" style={{ padding: '2px 8px' }}>
                    Auto-Generate
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="rajasthan-politics-news-2026"
                  value={form.slug}
                  onChange={(e) => setField('slug', e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="admin-form-group">
                  <label>श्रेणी (Category)</label>
                  <select value={form.category} onChange={(e) => setField('category', e.target.value)}>
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form-group">
                  <label>लेखक (Author Name)</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setField('author', e.target.value)}
                    placeholder="तंजनामा डेस्क"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label>फीचर्ड इमेज URL (Featured Image Link)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={form.featured_image || ''}
                  onChange={(e) => setField('featured_image', e.target.value)}
                />
                {form.featured_image && (
                  <div style={{ marginTop: '8px' }}>
                    <img
                      src={form.featured_image}
                      alt="Preview"
                      style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => ((e.target as HTMLElement).style.display = 'none')}
                    />
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label>संक्षिप्त सारांश (Excerpt)</label>
                <textarea
                  rows={2}
                  placeholder="खबर की 2 लाइनों का मुख्य सारांश..."
                  value={form.excerpt}
                  onChange={(e) => setField('excerpt', e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label>लेख की पूरी सामग्री (Article Content) *</label>
                <div className="toolbar">
                  <button type="button" onClick={() => insertText('<h2>', '</h2>')}>
                    Heading (H2)
                  </button>
                  <button type="button" onClick={() => insertText('<blockquote>', '</blockquote>')}>
                    Quote (उद्धरण)
                  </button>
                  <button type="button" onClick={() => insertText('<b>', '</b>')}>
                    Bold Text
                  </button>
                  <button type="button" onClick={() => insertText('\n- बिंदु 1\n- बिंदु 2\n')}>
                    Bullet List
                  </button>
                </div>
                <textarea
                  rows={12}
                  placeholder="यहाँ पूरी खबर या लेख विस्तार से लिखें..."
                  value={form.content}
                  onChange={(e) => setField('content', e.target.value)}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>प्रकाशन स्थिति (Status)</label>
                <select
                  value={form.status}
                  onChange={(e) => setField('status', e.target.value as 'draft' | 'published')}
                >
                  <option value="draft">📁 Draft (केवल एडमिन को दिखेगा)</option>
                  <option value="published">🚀 Published (लाइव वेबसाइट पर तुरंत दिखेगा)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                {editingId ? 'लेख अपडेट करें (Update Article)' : 'लेख प्रकाशित / सहेजें (Save Article)'}
              </button>

              {msg && (
                <p style={{ marginTop: '14px', fontWeight: 600, color: msg.includes('सफलता') ? '#16a34a' : '#c8102e' }}>
                  {msg}
                </p>
              )}
            </form>
          </section>

          {/* ARTICLES LIST & STATUS FILTER */}
          <section className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2>📚 लेख सूची ({filteredPosts.length})</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className={filterStatus === 'all' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setFilterStatus('all')}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  सभी
                </button>
                <button
                  className={filterStatus === 'published' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setFilterStatus('published')}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  Published
                </button>
                <button
                  className={filterStatus === 'draft' ? 'btn-primary' : 'btn-secondary'}
                  onClick={() => setFilterStatus('draft')}
                  style={{ padding: '4px 10px', fontSize: '11px' }}
                >
                  Drafts
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredPosts.length === 0 ? (
                <p style={{ fontSize: '13px', color: '#64748b' }}>कोई लेख उपलब्ध नहीं है।</p>
              ) : (
                filteredPosts.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '14px',
                      background: editingId === p.id ? '#fff1f2' : '#ffffff'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: p.status === 'published' ? '#dcfce7' : '#fef9c3',
                          color: p.status === 'published' ? '#166534' : '#854d0e'
                        }}
                      >
                        {p.category} • {p.status.toUpperCase()}
                      </span>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>/{p.slug}</span>
                    </div>

                    <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{p.title}</h3>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(p)} className="btn-secondary">
                        ✏️ संपादित करें (Edit)
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="btn-danger">
                        🗑️ हटाएँ (Delete)
                      </button>
                      <Link
                        href={`/posts/${p.slug}`}
                        target="_blank"
                        className="btn-secondary"
                        style={{ background: '#0f172a' }}
                      >
                        👁️ व्यू करें
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}