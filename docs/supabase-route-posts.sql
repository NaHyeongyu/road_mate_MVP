create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.route_posts (
  id text primary key,
  kind text not null check (kind in ('regular', 'one_time')),
  is_active boolean not null default true,
  notice_date date,
  return_date date,
  from_location text not null check (length(btrim(from_location)) > 0),
  to_location text not null check (length(btrim(to_location)) > 0),
  schedule text not null check (schedule ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'),
  return_schedule text check (
    return_schedule is null
    or return_schedule ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$'
  ),
  available_seats integer not null check (available_seats between 1 and 8),
  operating_days text[] not null default '{}' check (
    operating_days <@ array['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']::text[]
    and cardinality(operating_days) <= 7
    and (kind <> 'regular' or cardinality(operating_days) > 0)
  ),
  contact_phone text,
  contact_link text,
  note text not null default '' check (char_length(note) <= 500),
  vehicle_model text not null check (length(btrim(vehicle_model)) > 0),
  vehicle_plate text not null check (length(btrim(vehicle_plate)) > 0),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  owner_name text not null default 'Community driver',
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint route_posts_one_time_notice_date_chk
    check (kind <> 'one_time' or notice_date is not null),
  constraint route_posts_regular_dates_null_chk
    check (kind <> 'regular' or (notice_date is null and return_date is null)),
  constraint route_posts_one_time_return_pair_chk
    check (
      kind <> 'one_time'
      or (
        (return_schedule is null and return_date is null)
        or (return_schedule is not null and return_date is not null)
      )
    ),
  constraint route_posts_regular_contact_method_chk
    check (
      kind <> 'regular'
      or nullif(btrim(coalesce(contact_phone, '')), '') is not null
      or nullif(btrim(coalesce(contact_link, '')), '') is not null
    ),
  constraint route_posts_regular_active_chk
    check (kind <> 'regular' or is_active = true)
);

drop index if exists route_posts_owner_kind_key;

create unique index if not exists route_posts_owner_regular_key
  on public.route_posts (owner_user_id)
  where kind = 'regular';

create unique index if not exists route_posts_owner_active_one_time_key
  on public.route_posts (owner_user_id)
  where kind = 'one_time' and is_active = true;

create index if not exists route_posts_kind_visibility_created_idx
  on public.route_posts (kind, is_public, created_at desc);

create index if not exists route_posts_notice_date_created_idx
  on public.route_posts (notice_date desc, created_at desc);

create index if not exists route_posts_owner_kind_active_created_idx
  on public.route_posts (owner_user_id, kind, is_active, created_at desc);

create index if not exists route_posts_from_location_trgm_idx
  on public.route_posts
  using gin (from_location gin_trgm_ops);

create index if not exists route_posts_to_location_trgm_idx
  on public.route_posts
  using gin (to_location gin_trgm_ops);

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
  vehicle_model text not null default '' check (length(btrim(vehicle_model)) > 0),
  vehicle_plate text not null default '' check (length(btrim(vehicle_plate)) > 0),
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

create table if not exists public.admin_accounts (
  email text primary key,
  display_name text not null default '',
  role text not null default 'operator' check (role in ('owner', 'operator')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_admin_accounts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_accounts_set_updated_at on public.admin_accounts;
create trigger admin_accounts_set_updated_at
before update on public.admin_accounts
for each row
execute function public.set_admin_accounts_updated_at();

create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_accounts
    where enabled = true
      and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

create or replace function public.claim_initial_admin_account()
returns public.admin_accounts
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  authenticated_email text;
  claimed_account public.admin_accounts;
begin
  authenticated_email := lower(trim(coalesce(auth.jwt() ->> 'email', '')));

  if auth.uid() is null or authenticated_email = '' then
    raise exception 'Authenticated email is required.' using errcode = '42501';
  end if;

  lock table public.admin_accounts in exclusive mode;

  if exists (select 1 from public.admin_accounts) then
    raise exception 'Initial admin account already exists.' using errcode = '23505';
  end if;

  insert into public.admin_accounts (email, role, enabled)
  values (authenticated_email, 'owner', true)
  returning * into claimed_account;

  return claimed_account;
end;
$$;

revoke all on function public.claim_initial_admin_account() from public;
grant execute on function public.claim_initial_admin_account() to authenticated;

alter table public.admin_accounts enable row level security;

drop policy if exists admin_accounts_select_admin on public.admin_accounts;
create policy admin_accounts_select_admin
on public.admin_accounts
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists admin_accounts_insert_admin on public.admin_accounts;
create policy admin_accounts_insert_admin
on public.admin_accounts
for insert
to authenticated
with check (public.is_current_user_admin());

drop policy if exists admin_accounts_update_admin on public.admin_accounts;
create policy admin_accounts_update_admin
on public.admin_accounts
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists admin_accounts_delete_admin on public.admin_accounts;
create policy admin_accounts_delete_admin
on public.admin_accounts
for delete
to authenticated
using (public.is_current_user_admin());

drop policy if exists route_posts_select_admin on public.route_posts;
create policy route_posts_select_admin
on public.route_posts
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists route_posts_insert_admin on public.route_posts;
create policy route_posts_insert_admin
on public.route_posts
for insert
to authenticated
with check (public.is_current_user_admin());

drop policy if exists route_posts_update_admin on public.route_posts;
create policy route_posts_update_admin
on public.route_posts
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists route_posts_delete_admin on public.route_posts;
create policy route_posts_delete_admin
on public.route_posts
for delete
to authenticated
using (public.is_current_user_admin());

drop policy if exists driver_profiles_select_admin on public.driver_profiles;
create policy driver_profiles_select_admin
on public.driver_profiles
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists driver_profiles_update_admin on public.driver_profiles;
create policy driver_profiles_update_admin
on public.driver_profiles
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists driver_profiles_delete_admin on public.driver_profiles;
create policy driver_profiles_delete_admin
on public.driver_profiles
for delete
to authenticated
using (public.is_current_user_admin());

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('inquiry', 'bug', 'change_request', 'other')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  user_id uuid references auth.users (id) on delete set null,
  user_email text not null check (length(btrim(user_email)) > 0),
  title text not null check (length(btrim(title)) > 0 and char_length(title) <= 120),
  message text not null check (length(btrim(message)) > 0 and char_length(message) <= 2000),
  admin_note text not null default '' check (char_length(admin_note) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists support_requests_status_created_idx
  on public.support_requests (status, created_at desc);

create index if not exists support_requests_category_created_idx
  on public.support_requests (category, created_at desc);

create index if not exists support_requests_user_id_created_idx
  on public.support_requests (user_id, created_at desc);

create or replace function public.set_support_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();

  if new.status in ('resolved', 'closed') and old.status is distinct from new.status then
    new.resolved_at = now();
  elsif new.status not in ('resolved', 'closed') then
    new.resolved_at = null;
  end if;

  return new;
end;
$$;

drop trigger if exists support_requests_set_updated_at on public.support_requests;
create trigger support_requests_set_updated_at
before update on public.support_requests
for each row
execute function public.set_support_requests_updated_at();

alter table public.support_requests enable row level security;

drop policy if exists support_requests_insert_public on public.support_requests;
create policy support_requests_insert_public
on public.support_requests
for insert
to anon, authenticated
with check (
  user_id is null
  or auth.uid() = user_id
);

drop policy if exists support_requests_select_own on public.support_requests;
create policy support_requests_select_own
on public.support_requests
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists support_requests_select_admin on public.support_requests;
create policy support_requests_select_admin
on public.support_requests
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists support_requests_update_admin on public.support_requests;
create policy support_requests_update_admin
on public.support_requests
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists support_requests_delete_admin on public.support_requests;
create policy support_requests_delete_admin
on public.support_requests
for delete
to authenticated
using (public.is_current_user_admin());

create or replace function public.is_email_registered(check_email text)
returns boolean
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  normalized_email text;
begin
  normalized_email := lower(trim(check_email));

  if normalized_email is null or normalized_email = '' then
    return false;
  end if;

  return exists (
    select 1
    from auth.users
    where lower(coalesce(email, '')) = normalized_email
  );
end;
$$;

revoke all on function public.is_email_registered(text) from public;
grant execute on function public.is_email_registered(text) to anon, authenticated;
