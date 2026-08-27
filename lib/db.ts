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
  video_url?: string | null;
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

const initialFallbackPosts: Post[] = [];
let inMemoryPosts: Post[] = [];
let inMemoryTicker: TickerItem[] = [];

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
    console.warn('Supabase DB fetch failed, using memory:', e);
  }
  return inMemoryPosts.filter((p) => p.status === 'published').slice(0, limit);
}

export async function getPostsByCategory(categoryName: string, limit = 50): Promise<Post[]> {
  const all = await getPublishedPosts(limit);
  return all.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase());
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const rows = (await request(`posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`)) as Post[] | null;
    if (rows && rows[0]) return rows[0];
  } catch (e) {
    console.warn('Supabase getPost failed, searching memory:', e);
  }
  return inMemoryPosts.find((p) => p.slug === slug && p.status === 'published') || null;
}

export async function getAdminPosts(): Promise<Post[]> {
  try {
    const live = (await request('posts?order=created_at.desc')) as Post[] | null;
    if (live) return live;
  } catch (e) {
    console.warn('Supabase getAdminPosts failed, using memory:', e);
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
    video_url: data.video_url || null,
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