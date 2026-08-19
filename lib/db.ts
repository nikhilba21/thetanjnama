const base = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type Post = { id:string; title:string; slug:string; excerpt:string; content:string; category:string; author:string; featured_image:string|null; status:'draft'|'published'; seo_title:string|null; seo_description:string|null; published_at:string|null; created_at:string; updated_at:string };

async function request(path:string, init:RequestInit={}) {
  if (!base || !key) throw new Error('Supabase environment variables are missing');
  const res = await fetch(`${base}/rest/v1/${path}`, { ...init, headers:{ apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json', Prefer:'return=representation', ...(init.headers||{}) }, cache:'no-store' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function getPublishedPosts(limit=12){ return request(`posts?status=eq.published&order=published_at.desc&limit=${limit}`) as Promise<Post[]>; }
export async function getPost(slug:string){ const rows=await request(`posts?slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`) as Post[]; return rows[0]||null; }
export async function getAdminPosts(){ return request('posts?order=created_at.desc') as Promise<Post[]>; }
export async function createPost(data:Partial<Post>){ return request('posts',{method:'POST',body:JSON.stringify(data)}); }
export async function updatePost(id:string,data:Partial<Post>){ return request(`posts?id=eq.${encodeURIComponent(id)}`,{method:'PATCH',body:JSON.stringify(data)}); }
export async function deletePost(id:string){ return request(`posts?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'}); }