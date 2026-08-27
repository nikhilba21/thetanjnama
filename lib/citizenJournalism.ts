const base = process.env.TANJNAMA_SUPABASE_URL;
const key = process.env.TANJNAMA_SUPABASE_SERVICE_ROLE_KEY;

export type CitizenSubmission = {
  id: string;
  full_name: string;
  mobile_number: string;
  email?: string | null;
  city_district: string;
  news_type: string;
  title: string;
  location: string;
  description: string;
  has_media: string;
  is_original_permission: string;
  source_info?: string | null;
  declaration_consent: boolean;
  created_at: string;
};

let inMemorySubmissions: CitizenSubmission[] = [];

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

export async function submitCitizenReport(data: Partial<CitizenSubmission>): Promise<CitizenSubmission> {
  const newSubmission: CitizenSubmission = {
    id: `cj-${Date.now()}`,
    full_name: data.full_name || '',
    mobile_number: data.mobile_number || '',
    email: data.email || null,
    city_district: data.city_district || '',
    news_type: data.news_type || 'खबर',
    title: data.title || '',
    location: data.location || '',
    description: data.description || '',
    has_media: data.has_media || 'नहीं',
    is_original_permission: data.is_original_permission || 'हाँ',
    source_info: data.source_info || null,
    declaration_consent: data.declaration_consent ?? true,
    created_at: new Date().toISOString()
  };

  try {
    const res = await request('citizen_submissions', {
      method: 'POST',
      body: JSON.stringify(newSubmission)
    });
    if (res && res[0]) return res[0];
  } catch (e) {
    console.warn('Supabase citizen submission failed, storing in memory:', e);
  }

  inMemorySubmissions.unshift(newSubmission);
  return newSubmission;
}

export async function getCitizenSubmissions(): Promise<CitizenSubmission[]> {
  try {
    const live = (await request('citizen_submissions?order=created_at.desc')) as CitizenSubmission[] | null;
    if (live && live.length > 0) return live;
  } catch (e) {
    console.warn('Supabase citizen fetch failed, using memory:', e);
  }
  return inMemorySubmissions;
}

export async function deleteCitizenSubmission(id: string): Promise<boolean> {
  try {
    await request(`citizen_submissions?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    return true;
  } catch (e) {
    console.warn('Supabase citizen delete failed:', e);
  }

  inMemorySubmissions = inMemorySubmissions.filter((s) => s.id !== id);
  return true;
}
