create extension if not exists pgcrypto;

create table if not exists public.route_posts (
  id text primary key,
  kind text not null check (kind in ('regular', 'one_time')),
  notice_date date,
  from_location text not null,
  to_location text not null,
  schedule text not null,
  return_schedule text,
  available_seats integer not null check (available_seats between 1 and 8),
  operating_days text[] not null default '{}',
  contact_phone text,
  contact_link text,
  note text not null default '',
  vehicle_model text not null,
  vehicle_plate text not null,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  owner_name text not null default 'Community driver',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists route_posts_owner_kind_key
  on public.route_posts (owner_user_id, kind);

create index if not exists route_posts_kind_visibility_created_idx
  on public.route_posts (kind, is_public, created_at desc);

create index if not exists route_posts_notice_date_created_idx
  on public.route_posts (notice_date desc, created_at desc);

create or replace function public.set_route_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists route_posts_set_updated_at on public.route_posts;
create trigger route_posts_set_updated_at
before update on public.route_posts
for each row
execute function public.set_route_posts_updated_at();

alter table public.route_posts enable row level security;

drop policy if exists route_posts_select_public_or_own on public.route_posts;
create policy route_posts_select_public_or_own
on public.route_posts
for select
to authenticated, anon
using (is_public = true or auth.uid() = owner_user_id);

drop policy if exists route_posts_insert_own on public.route_posts;
create policy route_posts_insert_own
on public.route_posts
for insert
to authenticated
with check (auth.uid() = owner_user_id);

drop policy if exists route_posts_update_own on public.route_posts;
create policy route_posts_update_own
on public.route_posts
for update
to authenticated
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists route_posts_delete_own on public.route_posts;
create policy route_posts_delete_own
on public.route_posts
for delete
to authenticated
using (auth.uid() = owner_user_id);

create table if not exists public.driver_profiles (
  owner_user_id uuid primary key references auth.users (id) on delete cascade,
  vehicle_model text not null default '',
  vehicle_plate text not null default '',
  vehicle_note text not null default '',
  contact_phone text,
  contact_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_driver_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists driver_profiles_set_updated_at on public.driver_profiles;
create trigger driver_profiles_set_updated_at
before update on public.driver_profiles
for each row
execute function public.set_driver_profiles_updated_at();

alter table public.driver_profiles enable row level security;

drop policy if exists driver_profiles_select_own on public.driver_profiles;
create policy driver_profiles_select_own
on public.driver_profiles
for select
to authenticated
using (auth.uid() = owner_user_id);

drop policy if exists driver_profiles_insert_own on public.driver_profiles;
create policy driver_profiles_insert_own
on public.driver_profiles
for insert
to authenticated
with check (auth.uid() = owner_user_id);

drop policy if exists driver_profiles_update_own on public.driver_profiles;
create policy driver_profiles_update_own
on public.driver_profiles
for update
to authenticated
using (auth.uid() = owner_user_id)
with check (auth.uid() = owner_user_id);

drop policy if exists driver_profiles_delete_own on public.driver_profiles;
create policy driver_profiles_delete_own
on public.driver_profiles
for delete
to authenticated
using (auth.uid() = owner_user_id);
