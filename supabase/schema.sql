create extension if not exists pgcrypto;

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null default '',
  content text not null default '',
  category text not null default 'राष्ट्रीय',
  author text not null default 'Tanjnama Desk',
  featured_image text,
  status text not null default 'draft' check (status in ('draft','published')),
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_status_date_idx on public.posts(status, published_at desc);
create index if not exists posts_category_idx on public.posts(category);
create index if not exists posts_slug_idx on public.posts(slug);

alter table public.posts enable row level security;
create policy "published posts are public" on public.posts for select using (status='published');

-- Admin writes are performed server-side with SUPABASE_SERVICE_ROLE_KEY.
-- Never expose the service-role key in NEXT_PUBLIC_* variables.