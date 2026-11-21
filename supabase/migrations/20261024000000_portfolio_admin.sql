create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.brands (
  name text primary key,
  logo_url text,
  tagline text not null default '',
  description text not null default '',
  sector text not null default '',
  website_url text not null default '',
  accent_color text not null default '#8ab3aa',
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id text primary key,
  slug text not null unique,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.brands to anon, authenticated;
grant insert, update, delete on public.projects, public.brands to authenticated;
grant select on public.admin_users to authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

alter table public.admin_users enable row level security;
alter table public.brands enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Admins can view their own admin record" on public.admin_users;
create policy "Admins can view their own admin record" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Public can read brands" on public.brands;
create policy "Public can read brands" on public.brands
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage brands" on public.brands;
create policy "Admins can manage brands" on public.brands
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects" on public.projects
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage projects" on public.projects;
create policy "Admins can manage projects" on public.projects
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'campaign-media',
  'campaign-media',
  true,
  524288000,
  array['video/mp4', 'video/webm', 'image/jpeg', 'image/png', 'image/webp', 'text/vtt']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read campaign media" on storage.objects;
create policy "Public can read campaign media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'campaign-media');
drop policy if exists "Admins can upload campaign media" on storage.objects;
create policy "Admins can upload campaign media" on storage.objects
  for insert to authenticated with check (bucket_id = 'campaign-media' and (select public.is_admin()));
drop policy if exists "Admins can update campaign media" on storage.objects;
create policy "Admins can update campaign media" on storage.objects
  for update to authenticated using (bucket_id = 'campaign-media' and (select public.is_admin()))
  with check (bucket_id = 'campaign-media' and (select public.is_admin()));
drop policy if exists "Admins can delete campaign media" on storage.objects;
create policy "Admins can delete campaign media" on storage.objects
  for delete to authenticated using (bucket_id = 'campaign-media' and (select public.is_admin()));
