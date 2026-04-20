create table if not exists public.admin_accounts (
  email text primary key,
  display_name text not null default '',
  role text not null default 'operator' check (role in ('owner', 'operator')),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.admin_accounts (email, enabled, created_at, updated_at)
select email, enabled, created_at, updated_at
from public.admin_users
on conflict (email) do update
set
  enabled = excluded.enabled,
  updated_at = excluded.updated_at;

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

drop policy if exists admin_users_select_admin on public.admin_users;
drop policy if exists admin_users_insert_admin on public.admin_users;
drop policy if exists admin_users_update_admin on public.admin_users;
drop policy if exists admin_users_delete_admin on public.admin_users;
drop table if exists public.admin_users;
drop function if exists public.set_admin_users_updated_at();
