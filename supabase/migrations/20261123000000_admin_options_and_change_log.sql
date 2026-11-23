create table if not exists public.portfolio_options (
  id uuid primary key default gen_random_uuid(),
  field text not null check (field in (
    'sector', 'businessCategory', 'campaignType', 'adFormat',
    'language', 'platform', 'orientation', 'tags'
  )),
  value text not null check (length(btrim(value)) > 0),
  created_at timestamptz not null default now(),
  unique (field, value)
);

insert into public.portfolio_options (field, value) values
  ('sector', 'Automotive'), ('sector', 'Beauty & personal care'), ('sector', 'Culture & events'),
  ('sector', 'Education'), ('sector', 'Finance'), ('sector', 'Fitness & wellness'),
  ('sector', 'Food & beverage'), ('sector', 'Healthcare'), ('sector', 'Home & living'),
  ('sector', 'Retail'), ('sector', 'Technology'), ('sector', 'Travel & hospitality'),
  ('sector', 'Fashion & apparel'), ('sector', 'Real estate'), ('sector', 'Telecommunications'),
  ('sector', 'Non-profit & social impact'),
  ('businessCategory', 'Automotive'), ('businessCategory', 'Beauty'), ('businessCategory', 'Coffee'),
  ('businessCategory', 'Consumer electronics'), ('businessCategory', 'Food'), ('businessCategory', 'Beverages'),
  ('businessCategory', 'Financial services'), ('businessCategory', 'Fitness'), ('businessCategory', 'Home goods'),
  ('businessCategory', 'Hospitality'), ('businessCategory', 'Personal care'), ('businessCategory', 'Retail'),
  ('businessCategory', 'Software'), ('businessCategory', 'Travel'), ('businessCategory', 'Education'),
  ('businessCategory', 'Electric mobility'), ('businessCategory', 'Boutique stay'), ('businessCategory', 'Mobile payments'),
  ('businessCategory', 'Online learning'), ('businessCategory', 'Music festival'), ('businessCategory', 'Grocery'),
  ('businessCategory', 'Wellness'), ('businessCategory', 'Regional cuisine'), ('businessCategory', 'Smart home'),
  ('businessCategory', 'Audio'), ('businessCategory', 'Skin care'), ('businessCategory', 'Quick service'),
  ('businessCategory', 'Digital banking'), ('businessCategory', 'Live events'), ('businessCategory', 'Learning'),
  ('businessCategory', 'Plant-based drink'), ('businessCategory', 'Productivity software'), ('businessCategory', 'Running'),
  ('businessCategory', 'Interior paint'), ('businessCategory', 'Eco travel'), ('businessCategory', 'Hair care'),
  ('businessCategory', 'Savings'), ('businessCategory', 'Early learning'), ('businessCategory', 'Electric scooter'),
  ('businessCategory', 'Urban mobility'),
  ('campaignType', 'Brand awareness'), ('campaignType', 'Product launch'), ('campaignType', 'Festive campaign'),
  ('campaignType', 'Seasonal campaign'), ('campaignType', 'Promotional campaign'), ('campaignType', 'Event promotion'),
  ('campaignType', 'Influencer-led'), ('campaignType', 'Moment marketing'), ('campaignType', 'Testimonial'), ('campaignType', 'Recruitment'),
  ('campaignType', 'Corporate'), ('campaignType', 'Public service'), ('campaignType', 'Lead generation'),
  ('adFormat', 'Brand film'), ('adFormat', 'Social film'), ('adFormat', 'Product film'),
  ('adFormat', 'Digital video ad'), ('adFormat', 'Vertical advertisement'), ('adFormat', 'Theatre commercial'),
  ('adFormat', 'Television commercial'), ('adFormat', 'Testimonial film'), ('adFormat', 'Promotional video'),
  ('adFormat', 'Event trailer'), ('adFormat', 'Influencer collaboration'), ('adFormat', 'User-generated content'),
  ('adFormat', 'Short-form social'), ('adFormat', 'In-store advertisement'), ('adFormat', 'Song-based commercial'),
  ('language', 'English'), ('language', 'Hindi'), ('language', 'Tamil'), ('language', 'Malayalam'),
  ('language', 'Kannada'), ('language', 'Telugu'), ('language', 'Bengali'), ('language', 'Marathi'),
  ('language', 'Odia'), ('language', 'Assamese'), ('language', 'Urdu'), ('language', 'Punjabi'),
  ('language', 'Gujarati'),
  ('platform', 'YouTube'), ('platform', 'YouTube Shorts'), ('platform', 'Instagram'),
  ('platform', 'Instagram Reels'), ('platform', 'Facebook'), ('platform', 'TikTok'),
  ('platform', 'LinkedIn'), ('platform', 'Theatre'), ('platform', 'In-store'),
  ('platform', 'Television'), ('platform', 'Website'), ('platform', 'OTT'),
  ('orientation', 'Landscape'), ('orientation', 'Vertical'),
  ('tags', 'Brand story'), ('tags', 'Product'), ('tags', 'People'), ('tags', 'Storytelling'),
  ('tags', 'Food'), ('tags', 'Travel'), ('tags', 'Family'), ('tags', 'Festive'),
  ('tags', 'Culture'), ('tags', 'Music'), ('tags', 'Nature'), ('tags', 'Motion'),
  ('tags', 'Creator'), ('tags', 'Everyday'), ('tags', 'Behind the scenes'), ('tags', 'Lifestyle'),
  ('tags', 'Morning'), ('tags', 'Atmospheric'), ('tags', 'Sound'), ('tags', 'Fast-cut'),
  ('tags', 'Natural light'), ('tags', 'Seasonal'), ('tags', 'Quick edit'), ('tags', 'Event'),
  ('tags', 'Learning'), ('tags', 'Creator style'), ('tags', 'Retail'), ('tags', 'Escape'),
  ('tags', 'Slow living'), ('tags', 'Energy'), ('tags', 'Quick-cut'), ('tags', 'Work'),
  ('tags', 'Human stories'), ('tags', 'Home'), ('tags', 'Together'), ('tags', 'City'),
  ('tags', 'Live'), ('tags', 'UGC'), ('tags', 'Wellbeing'), ('tags', 'Pause'),
  ('tags', 'Curiosity')
on conflict (field, value) do nothing;

create table if not exists public.change_log (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_name text,
  actor_email text,
  entity_type text not null check (entity_type in ('project', 'brand', 'option')),
  entity_key text not null,
  entity_label text not null,
  action text not null check (action in ('insert', 'update', 'delete')),
  before_record jsonb,
  after_record jsonb
);

create index if not exists change_log_created_at_idx on public.change_log (created_at desc);

alter table public.portfolio_options enable row level security;
alter table public.change_log enable row level security;

grant select on public.portfolio_options to anon, authenticated;
grant insert, update, delete on public.portfolio_options to authenticated;
grant select on public.change_log to authenticated;

drop policy if exists "Public can read portfolio options" on public.portfolio_options;
create policy "Public can read portfolio options" on public.portfolio_options
  for select to anon, authenticated using (true);
drop policy if exists "Admins can manage portfolio options" on public.portfolio_options;
create policy "Admins can manage portfolio options" on public.portfolio_options
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins can view change log" on public.change_log;
create policy "Admins can view change log" on public.change_log
  for select to authenticated using ((select public.is_admin()));

create or replace function public.record_admin_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  before_value jsonb;
  after_value jsonb;
  target_type text;
  target_key text;
  target_label text;
  actor_name_value text;
  actor_email_value text;
begin
  if tg_op <> 'INSERT' then
    before_value := to_jsonb(old);
  end if;
  if tg_op <> 'DELETE' then
    after_value := to_jsonb(new);
  end if;

  case tg_table_name
    when 'projects' then
      target_type := 'project';
      target_key := coalesce(after_value ->> 'id', before_value ->> 'id');
      target_label := coalesce(after_value -> 'data' ->> 'title', before_value -> 'data' ->> 'title', target_key);
    when 'brands' then
      target_type := 'brand';
      target_key := coalesce(after_value ->> 'name', before_value ->> 'name');
      target_label := target_key;
    when 'portfolio_options' then
      target_type := 'option';
      target_key := coalesce(after_value ->> 'id', before_value ->> 'id');
      target_label := coalesce(after_value ->> 'field', before_value ->> 'field')
        || ': ' || coalesce(after_value ->> 'value', before_value ->> 'value');
    else
      raise exception 'Unsupported audit table: %', tg_table_name;
  end case;

  select
    coalesce(nullif(u.raw_user_meta_data ->> 'full_name', ''), nullif(u.raw_user_meta_data ->> 'name', '')),
    u.email
  into actor_name_value, actor_email_value
  from auth.users as u
  where u.id = (select auth.uid());

  insert into public.change_log (
    actor_user_id, actor_name, actor_email, entity_type, entity_key, entity_label,
    action, before_record, after_record
  ) values (
    (select auth.uid()), actor_name_value, actor_email_value, target_type, target_key, target_label,
    lower(tg_op), before_value, after_value
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists projects_change_log on public.projects;
create trigger projects_change_log
  after insert or update or delete on public.projects
  for each row execute function public.record_admin_change();

drop trigger if exists brands_change_log on public.brands;
create trigger brands_change_log
  after insert or update or delete on public.brands
  for each row execute function public.record_admin_change();

drop trigger if exists portfolio_options_change_log on public.portfolio_options;
create trigger portfolio_options_change_log
  after insert or update or delete on public.portfolio_options
  for each row execute function public.record_admin_change();

revoke all on function public.record_admin_change() from public, anon, authenticated;
