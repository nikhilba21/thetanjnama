const base = process.env.TANJNAMA_SUPABASE_URL;
const key = process.env.TANJNAMA_SUPABASE_SERVICE_ROLE_KEY;

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  featured_image: string | null;
  status: 'draft' | 'published';
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TickerItem = {
  id: string;
  text: string;
  created_at: string;
};

const initialFallbackPosts: Post[] = [
  {
    id: 'f-1',
    title: 'राजस्थान की सियासत में फिर तेज हुई हलचल, बड़े फैसले पर सबकी नजर',
    slug: 'rajasthan-politics-updates-2026',
    excerpt: 'प्रदेश की राजनीति में लगातार बदलते समीकरणों के बीच अब अगला कदम किसका होगा, इस पर प्रदेश भर में गहन चर्चा जारी है।',
    content: `राजस्थान की राजनीति में एक बार फिर नए समीकरण बनते दिख रहे हैं। हालिया बैठकों और शीर्ष नेताओं के बयानों के बाद राजनीतिक गलियारों में कयासबाजी का दौर गर्म है।

कई विश्लेषकों का मानना है कि आने वाले दिनों में संगठन स्तर पर बड़े बदलाव देखने को मिल सकते हैं। जनता और विपक्ष दोनों की नजरें अब शीर्ष नेतृत्व के फैसले पर टिकी हुई हैं।

तंजनामा विश्लेषण: हर चुनाव से पहले वादों का जो बाजार सजता है, उसमें इस बार कौन सा नया ऑफर मिलने वाला है, यह देखना वाकई दिलचस्प होगा।`,
    category: 'राजस्थान',
    author: 'तंजनामा डेस्क',
    featured_image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
    status: 'published',
    seo_title: 'राजस्थान राजनीति 2026: बड़ा सियासी हलचल',
    seo_description: 'राजस्थान की राजनीति में बड़े फैसले की सुगबुगाहट। जानिए क्या हैं नए समीकरण।',
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'f-2',
    title: 'देश की राजनीति में नए सवाल, पुराने जवाबों से नहीं चलेगा काम',
    slug: 'national-politics-questions-2026',
    excerpt: 'बदलते राजनीतिक और सामाजिक माहौल में आम जनता अब केवल नारों से संतुष्ट होने के मूड में नहीं दिख रही है।',
    content: `राष्ट्रीय स्तर पर राजनीति के मायने तेजी से बदल रहे हैं। बेरोजगारी, महंगाई और विकास दर जैसे जमीनी मुद्दों पर सवाल अब सोशल मीडिया से लेकर सड़कों तक गूंज रहे हैं।

राजनीतिक विश्लेषकों के अनुसार, युवाओं की बढ़ती भागीदारी ने पुराने ढर्रे के चुनावी प्रचार को चुनौती दी है। जब तक ठोस धरातल पर काम नहीं दिखेगा, तब तक भाषणों का असर कम होता दिख रहा है।`,
    category: 'राष्ट्रीय',
    author: 'संपादकीय टीम',
    featured_image: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
    status: 'published',
    seo_title: 'राष्ट्रीय राजनीति: नए सवाल और चुनौतियां',
    seo_description: 'देश की वर्तमान राजनीति पर तीखा विश्लेषण और सवाल।',
    published_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'f-3',
    title: 'आज का तंज: जब बजट के भाषणों में सिर्फ वादे और उम्मीदें ही बचीं',
    slug: 'aaj-ka-tanj-budget-vaade',
    excerpt: 'हर साल आने वाले विजन डाक्यूमेंट्स में आम आदमी को क्या मिला, इस पर तंजनामा का खास दृष्टिकोण।',
    content: `बजट आ गया, भाषण हो गए, तालियां बज गईं। लेकिन जब जेब टटोली तो पता चला कि विकास दर तो बढ़ गई है, पर आम आदमी की थाली का तेल और दाल आज भी उतनी ही महंगी है।

तंजनामा का मानना है कि आंकड़े कागजों पर चाहे जितने चमकीले दिखें, असली परीक्षा आम नागरिक की जेब में होती है।`,
    category: 'आज का तंज',
    author: 'तंजनामा स्पेशल',
    featured_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
    status: 'published',
    seo_title: 'आज का तंज: बजट और वादे',
    seo_description: 'आम नागरिक के नजरिए से बजट और दावों पर तंजनामा का कटाक्ष।',
    published_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'f-4',
    title: 'आंकड़ों के पीछे की कहानी: जो खबरों की सुर्खियों में नहीं दिखती',
    slug: 'data-story-behind-headlines',
    excerpt: 'डेटा को गहराई से समझिए और जानिए खबरों की उस तस्वीर को जिसे आसानी से छिपा दिया जाता है।',
    content: `अक्सर सरकारी और गैर-सरकारी आंकड़ों को इस तरह पेश किया जाता है कि समस्या ही गायब लगे। लेकिन जब हम डेटा स्टोरी के जरिए गहराई में उतरते हैं, तो सच्चाई कुछ और बयां करती है।`,
    category: 'Data Story',
    author: 'डेटा लैब',
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    status: 'published',
    seo_title: 'Data Story: खबरों के पीछे की सच्चाई',
    seo_description: 'तंजनामा डेटा स्टोरी - आंकड़ों का निष्पक्ष विश्लेषण।',
    published_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'f-5',
    title: 'सोशल मीडिया के दौर में बदलती नागरिक पत्रकारिता',
    slug: 'changing-citizen-journalism-social-media',
    excerpt: 'आम नागरिक अब केवल खबर देखने वाला दर्शक नहीं, बल्कि खुद रिपोर्टर और विश्लेषक बन चुका है।',
    content: `मोबाइल कैमरों और सोशल मीडिया ने नागरिक पत्रकारिता को नई दिशा दी है। अब किसी बड़ी घटना को दबाना नामुमकिन सा हो गया है।`,
    category: 'नागरिक पत्रकारिता',
    author: 'नागरिक रिपोर्टर',
    featured_image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    status: 'published',
    seo_title: 'नागरिक पत्रकारिता और डिजिटल मीडिया',
    seo_description: 'सोशल मीडिया के युग में नागरिक पत्रकारिता का असर।',
    published_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let inMemoryPosts: Post[] = [...initialFallbackPosts];

let inMemoryTicker: TickerItem[] = [
  { id: 't-1', text: 'TANJNAMA डिजिटल मंच पर आपका स्वागत है — सोच पर तंज, सच के साथ!', created_at: new Date().toISOString() },
  { id: 't-2', text: 'राजस्थान की सियासत में फिर तेज हुई हलचल, बड़े फैसले पर सबकी नजर।', created_at: new Date().toISOString() },
  { id: 't-3', text: 'देश की राजनीति और सामाजिक मुद्दों पर तंजनामा का तीखा निष्पक्ष विश्लेषण।', created_at: new Date().toISOString() }
];

async function request(path: string, init: RequestInit = {}) {
  if (!base || !key) return null;
  const res = await fetch(`${base}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
      ...(init.headers || {})
    },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getPublishedPosts(limit = 20): Promise<Post[]> {
  try {
    const live = (await request(`posts?status=eq.published&order=published_at.desc&limit=${limit}`)) as Post[] | null;
    if (live && live.length > 0) return live;
  } catch (e) {
    console.warn('Supabase DB fetch failed, using fallback mock data:', e);
  }
  return inMemoryPosts.filter((p) => p.status === 'published').slice(0, limit);
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const rows = (await request(`posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`)) as Post[] | null;
    if (rows && rows[0]) return rows[0];
  } catch (e) {
    console.warn('Supabase getPost failed, searching fallback:', e);
  }
  return inMemoryPosts.find((p) => p.slug === slug && p.status === 'published') || null;
}

export async function getAdminPosts(): Promise<Post[]> {
  try {
    const live = (await request('posts?order=created_at.desc')) as Post[] | null;
    if (live) return live;
  } catch (e) {
    console.warn('Supabase getAdminPosts failed, using fallback:', e);
  }
  return inMemoryPosts;
}

export async function createPost(data: Partial<Post>): Promise<Post> {
  const newPost: Post = {
    id: data.id || `post-${Date.now()}`,
    title: data.title || '',
    slug: data.slug || `post-${Date.now()}`,
    excerpt: data.excerpt || '',
    content: data.content || '',
    category: data.category || 'राष्ट्रीय',
    author: data.author || 'तंजनामा डेस्क',
    featured_image: data.featured_image || null,
    status: data.status || 'draft',
    seo_title: data.seo_title || data.title || null,
    seo_description: data.seo_description || data.excerpt || null,
    published_at: data.status === 'published' ? new Date().toISOString() : null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    const res = await request('posts', {
      method: 'POST',
      body: JSON.stringify(newPost)
    });
    if (res && res[0]) return res[0];
  } catch (e) {
    console.warn('Supabase createPost failed, storing in memory:', e);
  }

  inMemoryPosts.unshift(newPost);
  return newPost;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
    ...(data.status === 'published' ? { published_at: new Date().toISOString() } : {})
  };

  try {
    const res = await request(`posts?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePayload)
    });
    if (res && res[0]) return res[0];
  } catch (e) {
    console.warn('Supabase updatePost failed, updating memory:', e);
  }

  const idx = inMemoryPosts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    inMemoryPosts[idx] = { ...inMemoryPosts[idx], ...updatePayload };
    return inMemoryPosts[idx];
  }
  return null;
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    await request(`posts?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
    return true;
  } catch (e) {
    console.warn('Supabase deletePost failed, removing from memory:', e);
  }

  inMemoryPosts = inMemoryPosts.filter((p) => p.id !== id);
  return true;
}

export async function searchPosts(query: string): Promise<Post[]> {
  const q = query.toLowerCase();
  const all = await getPublishedPosts(100);
  return all.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q)
  );
}

// TICKER UPDATES FUNCTIONS
export async function getTickerUpdates(): Promise<TickerItem[]> {
  try {
    const live = (await request('ticker_updates?order=created_at.desc')) as TickerItem[] | null;
    if (live && live.length > 0) return live;
  } catch (e) {
    console.warn('Supabase ticker fetch failed, using memory:', e);
  }
  return inMemoryTicker;
}

export async function createTickerUpdate(text: string): Promise<TickerItem> {
  const newItem: TickerItem = {
    id: `ticker-${Date.now()}`,
    text: text.trim(),
    created_at: new Date().toISOString()
  };

  try {
    const res = await request('ticker_updates', {
      method: 'POST',
      body: JSON.stringify(newItem)
    });
    if (res && res[0]) return res[0];
  } catch (e) {
    console.warn('Supabase ticker save failed:', e);
  }

  inMemoryTicker.unshift(newItem);
  return newItem;
}

export async function deleteTickerUpdate(id: string): Promise<boolean> {
  try {
    await request(`ticker_updates?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    console.warn('Supabase ticker delete failed:', e);
  }

  inMemoryTicker = inMemoryTicker.filter((t) => t.id !== id);
  return true;
}

let isTickerActive = true;

export function getTickerStatus(): { active: boolean; items: TickerItem[] } {
  return {
    active: isTickerActive,
    items: inMemoryTicker
  };
}

export function setTickerStatus(active: boolean): boolean {
  isTickerActive = active;
  return isTickerActive;
}