import { getCategorySlugFromName } from '@/lib/categories';

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

let inMemoryPosts: Post[] = [];
let inMemoryTicker: TickerItem[] = [];

function isUuid(str?: string): boolean {
  if (!str) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

function getSupabaseCredentials() {
  const base =
    process.env.TANJNAMA_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;

  const key =
    process.env.TANJNAMA_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  return { base, key };
}

async function request(path: string, init: RequestInit = {}) {
  const { base, key } = getSupabaseCredentials();
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

  if (!res.ok) {
    const errText = await res.text();
    console.error(`Supabase REST Error [${res.status}]:`, errText);
    throw new Error(`Supabase REST [${res.status}]: ${errText}`);
  }
  return res.json();
}

export function sortPostsLatestFirst<T extends { published_at?: string | null; created_at?: string }>(posts: T[]): T[] {
  if (!Array.isArray(posts)) return [];
  return [...posts].sort((a, b) => {
    const timeA = new Date(a.published_at || a.created_at || 0).getTime();
    const timeB = new Date(b.published_at || b.created_at || 0).getTime();
    return timeB - timeA;
  });
}

export async function getPublishedPosts(limit = 50): Promise<Post[]> {
  try {
    const live = (await request(`posts?status=eq.published&order=published_at.desc&limit=${limit}`)) as Post[] | null;
    if (live && Array.isArray(live) && live.length > 0) {
      return sortPostsLatestFirst(live).slice(0, limit);
    }
  } catch (e) {
    console.warn('Supabase DB fetch failed, using memory fallback');
  }
  return sortPostsLatestFirst(inMemoryPosts.filter((p) => p.status === 'published')).slice(0, limit);
}

export async function getPostsByCategory(categorySlugOrName: string, limit = 50): Promise<Post[]> {
  const all = await getPublishedPosts(limit);
  const target = decodeURIComponent(categorySlugOrName).toLowerCase().trim();
  const isVideoCategory =
    target === 'videos' ||
    target === 'video' ||
    target === 'वीडियो' ||
    target === 'वीडियो समाचार' ||
    target.includes('video') ||
    target.includes('वीडियो');

  const filtered = all.filter((p) => {
    const cat = (p.category || '').toLowerCase().trim();
    if (isVideoCategory) {
      return (
        Boolean(p.video_url && p.video_url.trim().length > 0) ||
        cat === 'videos' ||
        cat === 'video' ||
        cat === 'वीडियो' ||
        cat === 'वीडियो समाचार' ||
        cat.includes('video') ||
        cat.includes('वीडियो')
      );
    }
    return cat === target || getCategorySlugFromName(p.category) === target;
  });

  return sortPostsLatestFirst(filtered);
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const rows = (await request(`posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`)) as Post[] | null;
    if (rows && Array.isArray(rows) && rows[0]) return rows[0];
  } catch (e) {
    console.warn('Supabase getPost failed');
  }
  return inMemoryPosts.find((p) => p.slug === slug && p.status === 'published') || null;
}

export async function getAdminPosts(): Promise<Post[]> {
  try {
    const live = (await request('posts?order=created_at.desc')) as Post[] | null;
    if (live && Array.isArray(live)) {
      return sortPostsLatestFirst(live);
    }
  } catch (e) {
    console.warn('Supabase getAdminPosts failed, using memory fallback');
  }
  return sortPostsLatestFirst(inMemoryPosts);
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
    status: data.status || 'published',
    seo_title: data.seo_title || data.title || null,
    seo_description: data.seo_description || data.excerpt || null,
    published_at: data.status === 'draft' ? null : new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Prepare payload for Supabase REST API
  // Omit custom non-UUID string IDs so Supabase PostgreSQL auto-generates valid UUIDs
  const supabasePayload = { ...newPost };
  if (!isUuid(supabasePayload.id)) {
    delete (supabasePayload as any).id;
  }

  // Try 1: Full payload
  try {
    const res = await request('posts', {
      method: 'POST',
      body: JSON.stringify(supabasePayload)
    });
    if (res && Array.isArray(res) && res[0]) return res[0];
  } catch (e: any) {
    console.warn('Supabase createPost warning:', e.message);

    // Try 2: If video_url column is missing in Supabase schema, retry without video_url
    if (e.message && e.message.includes('video_url')) {
      try {
        const { video_url, ...withoutVideo } = supabasePayload;
        const res2 = await request('posts', {
          method: 'POST',
          body: JSON.stringify(withoutVideo)
        });
        if (res2 && Array.isArray(res2) && res2[0]) return { ...res2[0], video_url: newPost.video_url };
      } catch (err2) {
        console.warn('Supabase retry without video_url failed:', err2);
      }
    }
  }

  // Fallback to memory
  const idx = inMemoryPosts.findIndex((p) => p.id === newPost.id || p.slug === newPost.slug);
  if (idx !== -1) {
    inMemoryPosts[idx] = newPost;
  } else {
    inMemoryPosts.unshift(newPost);
  }

  return newPost;
}

export async function updatePost(id: string, data: Partial<Post>): Promise<Post | null> {
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
    ...(data.status === 'published' ? { published_at: new Date().toISOString() } : {})
  };

  try {
    const filterQuery = isUuid(id) ? `id=eq.${encodeURIComponent(id)}` : `slug=eq.${encodeURIComponent(data.slug || id)}`;
    const res = await request(`posts?${filterQuery}`, {
      method: 'PATCH',
      body: JSON.stringify(updatePayload)
    });
    if (res && Array.isArray(res) && res[0]) return res[0];
  } catch (e: any) {
    console.warn('Supabase updatePost warning:', e.message);
  }

  const idx = inMemoryPosts.findIndex((p) => p.id === id || p.slug === data.slug);
  if (idx !== -1) {
    inMemoryPosts[idx] = { ...inMemoryPosts[idx], ...updatePayload };
    return inMemoryPosts[idx];
  }
  return null;
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const filterQuery = isUuid(id) ? `id=eq.${encodeURIComponent(id)}` : `slug=eq.${encodeURIComponent(id)}`;
    await request(`posts?${filterQuery}`, {
      method: 'DELETE'
    });
  } catch (e) {
    console.warn('Supabase deletePost failed');
  }

  inMemoryPosts = inMemoryPosts.filter((p) => p.id !== id && p.slug !== id);
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
    if (live && Array.isArray(live) && live.length > 0) return live;
  } catch (e) {
    console.warn('Supabase ticker fetch failed, using memory fallback');
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
    const payload = { text: text.trim(), created_at: newItem.created_at };
    const res = await request('ticker_updates', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && Array.isArray(res) && res[0]) return res[0];
  } catch (e) {
    console.warn('Supabase ticker save failed:', e);
  }

  inMemoryTicker.unshift(newItem);
  return newItem;
}

export async function deleteTickerUpdate(id: string): Promise<boolean> {
  try {
    const filterQuery = isUuid(id) ? `id=eq.${encodeURIComponent(id)}` : `id=eq.${encodeURIComponent(id)}`;
    await request(`ticker_updates?${filterQuery}`, { method: 'DELETE' });
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