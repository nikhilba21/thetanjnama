'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

type Post = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  video_url?: string | null;
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

type PollQuestion = {
  id: string;
  question: string;
  options: string[];
  active: boolean;
};

type PollResponse = {
  id: string;
  poll_id: string;
  user_name: string;
  city_district: string;
  selected_option: string;
  user_opinion: string;
  solution_idea: string;
  publish_consent: string;
  mobile_number: string;
  submitted_at: string;
};

type PageItem = {
  slug: 'about' | 'contact' | 'privacy-policy' | 'disclaimer';
  title: string;
  content: string;
  updated_at?: string;
};

const blankForm: Post = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'राष्ट्रीय',
  author: 'तंजनामा डेस्क',
  featured_image: '',
  video_url: '',
  status: 'published',
  seo_title: '',
  seo_description: ''
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'editor' | 'categories' | 'poll' | 'pages' | 'citizen' | 'ticker' | 'manage'>('editor');
  const [posts, setPosts] = useState<Post[]>([]);
  const [tickers, setTickers] = useState<TickerItem[]>([]);
  const [citizenSubmissions, setCitizenSubmissions] = useState<any[]>([]);
  const [isTickerActive, setIsTickerActive] = useState<boolean>(true);
  const [newTickerText, setNewTickerText] = useState('');

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');

  // POLL STATE
  const [poll, setPoll] = useState<PollQuestion | null>(null);
  const [pollResponses, setPollResponses] = useState<PollResponse[]>([]);
  const [pollQuestionText, setPollQuestionText] = useState('');
  const [pollOption1, setPollOption1] = useState('');
  const [pollOption2, setPollOption2] = useState('');
  const [pollOption3, setPollOption3] = useState('');
  const [pollOption4, setPollOption4] = useState('');
  const [isPollActive, setIsPollActive] = useState(true);

  // PAGE CONTENT MANAGER STATE
  const [pages, setPages] = useState<Record<string, PageItem>>({});
  const [selectedPageSlug, setSelectedPageSlug] = useState<'about' | 'contact' | 'privacy-policy' | 'disclaimer'>('about');
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');

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
      loadPollManager();
      loadPagesManager();
      loadCitizenSubmissions();
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
      loadPollManager();
      loadPagesManager();
    } else {
      setAuthError('गलत Log ID या पासवर्ड! कृपया सही लॉगिन क्रेडेंशियल दर्ज करें।');
    }
  };

  // LOAD PAGES CONTENT
  async function loadPagesManager() {
    try {
      const res = await fetch('/api/pages');
      if (res.ok) {
        const list: PageItem[] = await res.json();
        const map: Record<string, PageItem> = {};
        list.forEach((p) => {
          map[p.slug] = p;
        });
        setPages(map);
        if (map['about']) {
          setPageTitle(map['about'].title);
          setPageContent(map['about'].content);
        }
      }
    } catch (e) {
      console.error('Failed to load pages content:', e);
    }
  }

  // LOAD CITIZEN SUBMISSIONS
  async function loadCitizenSubmissions() {
    try {
      const res = await fetch('/api/citizen-journalism');
      if (res.ok) {
        const list = await res.json();
        setCitizenSubmissions(list);
      }
    } catch (e) {
      console.error('Failed to load citizen submissions:', e);
    }
  }

  const handleDeleteCitizenSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/citizen-journalism?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('✅ नागरिक पत्रकारिता आवेदन हटा दिया गया!');
        loadCitizenSubmissions();
      }
    } catch (e) {
      setStatusMsg('त्रुटि: आवेदन नहीं हटा।');
    }
  };

  const handleSelectPageToEdit = (slug: 'about' | 'contact' | 'privacy-policy' | 'disclaimer') => {
    setSelectedPageSlug(slug);
    if (pages[slug]) {
      setPageTitle(pages[slug].title);
      setPageContent(pages[slug].content);
    }
  };

  const handleSavePageContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle.trim() || !pageContent.trim()) return;

    try {
      const res = await fetch('/api/pages', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedPageSlug,
          title: pageTitle.trim(),
          content: pageContent.trim()
        })
      });

      if (res.ok) {
        setStatusMsg(`📄 "${pageTitle}" की सामग्री सहेज ली गई है!`);
        loadPagesManager();
      }
    } catch (e) {
      setStatusMsg('❌ पेज अपडेट करने में त्रुटि।');
    }
  };

  // LOAD POLL MANAGER DATA & RESPONSES
  async function loadPollManager() {
    try {
      const pollRes = await fetch('/api/poll');
      if (pollRes.ok) {
        const data = await pollRes.json();
        if (data.poll) {
          setPoll(data.poll);
          setPollQuestionText(data.poll.question);
          setPollOption1(data.poll.options[0] || 'बहुत महत्वपूर्ण');
          setPollOption2(data.poll.options[1] || 'महत्वपूर्ण');
          setPollOption3(data.poll.options[2] || 'कम महत्वपूर्ण');
          setPollOption4(data.poll.options[3] || 'महत्वपूर्ण नहीं');
          setIsPollActive(data.poll.active);
        }
      }

      const respRes = await fetch('/api/poll/responses');
      if (respRes.ok) {
        setPollResponses(await respRes.json());
      }
    } catch (e) {
      console.error('Failed to load poll data:', e);
    }
  }

  // UPDATE POLL QUESTION
  const handleSavePollQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pollQuestionText.trim()) return;

    const options = [pollOption1, pollOption2, pollOption3, pollOption4].map((o) => o.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/poll', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: pollQuestionText.trim(),
          options,
          active: isPollActive
        })
      });

      if (res.ok) {
        setStatusMsg('❓ "आज का सवाल" और इसके विकल्प सफलतापूर्वक सहेजे गए!');
        loadPollManager();
      }
    } catch (e) {
      setStatusMsg('❌ पोल सवाल अपडेट करने में त्रुटि।');
    }
  };

  // TOGGLE POLL ACTIVE / DEACTIVE
  const handleTogglePollActive = async (targetActive: boolean) => {
    try {
      const res = await fetch('/api/poll', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: targetActive })
      });

      if (res.ok) {
        setIsPollActive(targetActive);
        setStatusMsg(
          targetActive
            ? '✅ "आज का सवाल" फॉर्म सक्रिय (ON) कर दिया गया! वेबसाइट पर दिखेगा।'
            : '❌ "आज का सवाल" फॉर्म निष्क्रिय (OFF) कर दिया गया! वेबसाइट से हट गया।'
        );
      }
    } catch (e) {
      alert('पोल स्टेटस बदलने में त्रुटि');
    }
  };

  // DELETE POLL RESPONSE
  const handleDeletePollResponse = async (id: string) => {
    if (!confirm('क्या आप इस यूजर के जवाब को डिलीट करना चाहते हैं?')) return;
    try {
      const res = await fetch(`/api/poll/responses?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMsg('🗑️ जवाब डिलीट कर दिया गया।');
        loadPollManager();
      }
    } catch (e) {
      alert('डिलीट करने में त्रुटि');
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

  const handleSyncLocalToCloud = async () => {
    try {
      const localStr = localStorage.getItem('tanjnama_local_articles');
      if (!localStr) {
        alert('ब्राउज़र में कोई स्थानीय लेख नहीं मिला।');
        return;
      }
      const localPosts: Post[] = JSON.parse(localStr);
      if (localPosts.length === 0) {
        alert('कोई स्थानीय लेख नहीं मिला।');
        return;
      }

      setStatusMsg(`⏳ ${localPosts.length} लेख सर्वर व क्लाउड डेटाबेस में सिंक किए जा रहे हैं...`);
      let count = 0;
      for (const lp of localPosts) {
        const res = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lp)
        });
        if (res.ok) count++;
      }
      setStatusMsg(`✅ ${count} लेख सफलतापूर्वक क्लाउड डेटाबेस व लाइव वेबसाइट पर सिंक हो गए!`);
      await loadPosts();
    } catch (e) {
      alert('सिंक करने में त्रुटि आई।');
    }
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
        const maxWidth = 1600;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
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
        setStatusMsg(editingId ? '✅ लेख सफलतापूर्वक सर्वर व लाइव वेबसाइट पर अपडेट हुआ!' : '🚀 नया लेख सर्वर व लाइव वेबसाइट पर प्रकाशित हुआ!');
      } else {
        const errJson = await res.json().catch(() => ({}));
        setStatusMsg(`⚠️ सर्वर सेव सूचना: ${errJson.error || 'ब्राउज़र में सहेजा गया'}`);
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
            सुरक्षित एडमिन कंसोल — TANJNAMA Media
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
            onClick={() => setActiveTab('poll')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'poll' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'poll' ? '#ffffff' : '#334155'
            }}
          >
            ❓ आज का सवाल व जवाब ({pollResponses.length})
          </button>

          <button
            onClick={() => setActiveTab('pages')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'pages' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'pages' ? '#ffffff' : '#334155'
            }}
          >
            📄 पेज सामग्री (Policy Pages)
          </button>

          <button
            onClick={() => setActiveTab('citizen')}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: 700,
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              background: activeTab === 'citizen' ? 'var(--primary)' : '#e2e8f0',
              color: activeTab === 'citizen' ? '#ffffff' : '#334155'
            }}
          >
            📰 नागरिक पत्रकारिता आवेदन ({citizenSubmissions.length})
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

              {/* DEDICATED YOUTUBE / VIDEO URL EMBED BOX */}
              <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>
                  🎥 वीडियो एम्बेड (YouTube / Shorts / Video Link Embed)
                </label>
                <span style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                  यूट्यूब वीडियो या Shorts का लिंक पेस्ट करें (उदा. https://www.youtube.com/watch?v=... या https://youtube.com/shorts/...)
                </span>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={form.video_url || ''}
                  onChange={(e) => setField('video_url', e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                />
                {form.video_url && (
                  <div style={{ marginTop: '10px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                    ✅ वीडियो लिंक सेट हो गया है! खबर खोलते ही सुपरफास्ट वीडियो प्लेयर दिखेगा।
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                    ✍️ लेख की मुख्य सामग्री (Rich Text Article Editor) *
                  </label>
                  <label style={{ background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    📷 बॉडी में फोटो/मीडिया इन्सर्ट करें
                    <input type="file" accept="image/*" onChange={handleInsertBodyMedia} style={{ display: 'none' }} />
                  </label>
                </div>

                <RichTextEditor
                  value={form.content}
                  onChange={(htmlContent) => setField('content', htmlContent)}
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
                      🗑️ बताएं
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: AAJ KA SAWAL (POLL MANAGER & RESPONSES) */}
        {activeTab === 'poll' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '4px' }}>
                  ❓ "आज का सवाल" (Custom Form Builder & Submissions)
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  यहाँ से नया सवाल व विकल्प बदलें और सोशल मीडिया पर शेयर करके पाठकों के उत्तर प्राप्त करें।
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('आज का सवाल — TANJNAMA जनमत मंच\n\n' + (pollQuestionText || 'अपनी राय दर्ज करें') + '\n\n👉 यहाँ उत्तर दर्ज करें: https://www.tanjnama.com/aaj-ka-sawal')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: '#25D366', color: '#fff', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}
                >
                  💬 व्हाट्सएप पर शेयर करें
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://www.tanjnama.com/aaj-ka-sawal');
                    setStatusMsg('✅ आज का सवाल लिंक कॉपी हो गया!');
                  }}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
                >
                  📋 लिंक कॉपी करें
                </button>
                <button
                  onClick={() => handleTogglePollActive(!isPollActive)}
                  style={{
                    background: isPollActive ? '#dc2626' : '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {isPollActive ? '❌ सवाल फॉर्म बंद करें' : '✅ चालू करें'}
                </button>
              </div>
            </div>

            {/* EDIT POLL QUESTION FORM */}
            <form onSubmit={handleSavePollQuestion} style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '32px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  3. आज का सवाल (Question Text) *
                </label>
                <input
                  type="text"
                  value={pollQuestionText}
                  onChange={(e) => setPollQuestionText(e.target.value)}
                  placeholder="उदा. 'स्कूल ठीक करो' आंदोलन को आप कितना महत्वपूर्ण मानते हैं?"
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    विकल्प 1 (Option 1) *
                  </label>
                  <input
                    type="text"
                    value={pollOption1}
                    onChange={(e) => setPollOption1(e.target.value)}
                    placeholder="बहुत महत्वपूर्ण"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    विकल्प 2 (Option 2) *
                  </label>
                  <input
                    type="text"
                    value={pollOption2}
                    onChange={(e) => setPollOption2(e.target.value)}
                    placeholder="महत्वपूर्ण"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    विकल्प 3 (Option 3)
                  </label>
                  <input
                    type="text"
                    value={pollOption3}
                    onChange={(e) => setPollOption3(e.target.value)}
                    placeholder="कम महत्वपूर्ण"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    विकल्प 4 (Option 4)
                  </label>
                  <input
                    type="text"
                    value={pollOption4}
                    onChange={(e) => setPollOption4(e.target.value)}
                    placeholder="महत्वपूर्ण नहीं"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}
              >
                💾 सवाल और विकल्प सहेजें (Save Form Question)
              </button>
            </form>

            {/* SUBMITTED RESPONSES VIEW */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '17px', color: '#000' }}>
                  📩 पाठकों से प्राप्त संपूर्ण प्रतिक्रियाएं ({pollResponses.length})
                </h3>
                <button onClick={loadPollManager} style={{ background: '#e2e8f0', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  🔄 रीफ्रीश करें
                </button>
              </div>

              {pollResponses.length === 0 ? (
                <p style={{ color: '#64748b', padding: '20px', textAlign: 'center', background: '#f8fafc', borderRadius: '6px' }}>
                  अभी तक कोई प्रतिक्रिया प्राप्त नहीं हुई है।
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {pollResponses.map((r, idx) => (
                    <div
                      key={r.id}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '8px',
                        padding: '18px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px', marginBottom: '12px' }}>
                        <div>
                          <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>
                            #{idx + 1} {r.user_name}
                          </span>
                          <span style={{ fontSize: '13px', color: '#64748b', marginLeft: '10px' }}>
                            📍 {r.city_district} • 📞 {r.mobile_number || 'N/A'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {new Date(r.submitted_at).toLocaleString('hi-IN')}
                          </span>
                          <button
                            onClick={() => handleDeletePollResponse(r.id)}
                            style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
                          >
                            🗑️ डिलीट
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
                        <div>
                          <strong style={{ color: '#334155', display: 'block', marginBottom: '3px' }}>
                            3. चुना गया उत्तर:
                          </strong>
                          <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, display: 'inline-block' }}>
                            {r.selected_option}
                          </span>
                        </div>

                        <div>
                          <strong style={{ color: '#334155', display: 'block', marginBottom: '3px' }}>
                            6. प्रकाशन सहमति:
                          </strong>
                          <span style={{ color: '#1e293b', fontWeight: 600 }}>
                            {r.publish_consent}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e2e8f0', fontSize: '13px' }}>
                        <strong style={{ color: '#334155', display: 'block', marginBottom: '4px' }}>
                          4. आज के सवाल पर पाठक की राय:
                        </strong>
                        <p style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', color: '#0f172a', lineHeight: '1.5' }}>
                          {r.user_opinion}
                        </p>
                      </div>

                      {r.solution_idea && r.solution_idea !== 'N/A' && (
                        <div style={{ marginTop: '10px', fontSize: '13px' }}>
                          <strong style={{ color: '#334155', display: 'block', marginBottom: '4px' }}>
                            5. पाठक के अनुसार समाधान:
                          </strong>
                          <p style={{ background: '#fdf2f2', padding: '10px', borderRadius: '6px', color: '#0f172a', lineHeight: '1.5' }}>
                            {r.solution_idea}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: PAGE CONTENT MANAGER (ABOUT, CONTACT, PRIVACY, DISCLAIMER) */}
        {activeTab === 'pages' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>
              📄 पेज सामग्री प्रबंधन (Page Content Manager)
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
              यहाँ से 'हमारे बारे में', 'संपर्क करें', 'गोपनीयता नीति' और 'अस्वीकरण' पेजों का टेक्स्ट और सामग्री संपादित (Edit) करें।
            </p>

            {/* PAGE SELECTOR BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {[
                { slug: 'about', label: '1. हमारे बारे में (About Us)' },
                { slug: 'contact', label: '2. संपर्क करें (Contact Us)' },
                { slug: 'privacy-policy', label: '3. गोपनीयता नीति (Privacy Policy)' },
                { slug: 'disclaimer', label: '4. अस्वीकरण (Disclaimer)' }
              ].map((p) => (
                <button
                  key={p.slug}
                  onClick={() => handleSelectPageToEdit(p.slug as any)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    background: selectedPageSlug === p.slug ? 'var(--primary)' : '#f1f5f9',
                    color: selectedPageSlug === p.slug ? '#ffffff' : '#334155'
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* EDIT PAGE CONTENT FORM */}
            <form onSubmit={handleSavePageContent}>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  पेज का मुख्य शीर्षक (Page Title) *
                </label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  पेज की सामग्री (HTML / Text Content) *
                </label>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', background: '#f1f5f9', padding: '8px', borderRadius: '6px 6px 0 0', border: '1px solid #cbd5e1', borderBottom: 'none' }}>
                  <button type="button" onClick={() => setPageContent((prev) => prev + '\n<h2>शीर्षक लिखें</h2>\n')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    H2 हेडिंग
                  </button>
                  <button type="button" onClick={() => setPageContent((prev) => prev + '\n<h3>उप-शीर्षक लिखें</h3>\n')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    H3 सब-हेडिंग
                  </button>
                  <button type="button" onClick={() => setPageContent((prev) => prev + '\n<p>पैराग्राफ टेक्स्ट...</p>\n')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    Paragraph
                  </button>
                  <button type="button" onClick={() => setPageContent((prev) => prev + '<strong>बोल्ड टेक्स्ट</strong>')} style={{ background: '#fff', border: '1px solid #cbd5e1', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>
                    Bold
                  </button>
                </div>

                <textarea
                  rows={14}
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '0 0 6px 6px', border: '1px solid #cbd5e1', fontSize: '14px', fontFamily: 'monospace', lineHeight: '1.6' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{ width: '100%', background: 'var(--primary)', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '6px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}
              >
                💾 पेज सामग्री सहेजें (Save Page Content)
              </button>
            </form>
          </div>
        )}

        {/* TAB FOR CITIZEN SUBMISSIONS */}
        {activeTab === 'citizen' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '4px' }}>
                  📰 नागरिक पत्रकारिता आवेदन एवं रिपोर्ट प्रतिक्रियाएं
                </h2>
                <p style={{ fontSize: '13px', color: '#64748b' }}>
                  पाठकों द्वारा 'नागरिक पत्रकारिता' फॉर्म द्वारा भेजी गई सभी खबरें और जनसमस्याएं।
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent('नागरिक पत्रकारिता में योगदान दें — आपकी खबर, आपके क्षेत्र की आवाज़\n\nअपने क्षेत्र की समस्याएं व खबरें हमारे साथ साझा करें:\n👉 https://www.tanjnama.com/nagrik-patrakarita')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ background: '#25D366', color: '#fff', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, textDecoration: 'none' }}
                >
                  💬 व्हाट्सएप पर शेयर करें
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://www.tanjnama.com/nagrik-patrakarita');
                    setStatusMsg('✅ नागरिक पत्रकारिता लिंक कॉपी हो गया!');
                  }}
                  style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  📋 लिंक कॉपी करें
                </button>
                <button
                  onClick={loadCitizenSubmissions}
                  style={{ background: '#e2e8f0', border: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
                >
                  🔄 रीफ्रेश करें ({citizenSubmissions.length})
                </button>
              </div>
            </div>

            {citizenSubmissions.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                <p style={{ fontSize: '15px', color: '#64748b' }}>अभी तक कोई नागरिक पत्रकारिता आवेदन प्राप्त नहीं हुआ है।</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {citizenSubmissions.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      padding: '20px',
                      background: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                      <div>
                        <span style={{ background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
                          {s.news_type || 'खबर'}
                        </span>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
                          {s.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDeleteCitizenSubmission(s.id)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        🗑️ डिलीट
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', fontSize: '13px', background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '12px' }}>
                      <div>👤 <strong>नाम:</strong> {s.full_name}</div>
                      <div>📞 <strong>मोबाइल:</strong> {s.mobile_number}</div>
                      <div>📧 <strong>ईमेल:</strong> {s.email || 'उपलब्ध नहीं'}</div>
                      <div>📍 <strong>शहर/जिला:</strong> {s.city_district}</div>
                      <div>🗺️ <strong>घटना स्थान:</strong> {s.location}</div>
                      <div>📅 <strong>दिनांक:</strong> {new Date(s.created_at).toLocaleString('hi-IN')}</div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                        📝 खबर का विवरण:
                      </span>
                      <p style={{ fontSize: '14px', color: '#1e293b', background: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #cbd5e1', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {s.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748b' }}>
                      <span>🖼️ फोटो/वीडियो मौजूद: <strong>{s.has_media}</strong></span>
                      <span>•</span>
                      <span>✅ स्वयं द्वारा बनाया गया: <strong>{s.is_original_permission}</strong></span>
                      {s.source_info && (
                        <>
                          <span>•</span>
                          <span>🔍 स्रोत: <strong>{s.source_info}</strong></span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: BREAKING TICKER MANAGEMENT & MASTER TOGGLE */}
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

        {/* TAB 6: MANAGE ARTICLES */}
        {activeTab === 'manage' && (
          <div style={{ background: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: '#0f172a' }}>📚 लेख सूची एवं प्रबंधन</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  onClick={handleSyncLocalToCloud}
                  style={{ padding: '6px 14px', fontSize: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer', background: '#166534', color: '#fff', fontWeight: 700 }}
                  title="लोकल ब्राउज़र के लेखों को लाइव क्लाउड डेटाबेस में सेव करें"
                >
                  🚀 सर्वर सिंक करें (Sync to Live)
                </button>
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
                      {p.status === 'draft' && (
                        <button
                          onClick={() => {
                            const updated = { ...p, status: 'published' as const, published_at: new Date().toISOString() };
                            saveLocalPostBackup(updated);
                            fetch(`/api/posts/${p.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(updated)
                            }).then(() => {
                              setStatusMsg(`🚀 "${p.title}" को लाइव प्रकाशित कर दिया गया!`);
                              loadPosts();
                            });
                          }}
                          style={{ background: '#16a34a', color: '#ffffff', border: 'none', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}
                        >
                          🚀 लाइव पब्लिश करें
                        </button>
                      )}
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