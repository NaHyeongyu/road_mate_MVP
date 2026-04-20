create table if not exists public.admin_users (
  email text primary key,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_admin_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists admin_users_set_updated_at on public.admin_users;
create trigger admin_users_set_updated_at
before update on public.admin_users
for each row
execute function public.set_admin_users_updated_at();

create or replace function public.is_current_user_admin()
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from public.admin_users
    where enabled = true
      and lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

revoke all on function public.is_current_user_admin() from public;
grant execute on function public.is_current_user_admin() to authenticated;

alter table public.admin_users enable row level security;

drop policy if exists admin_users_select_admin on public.admin_users;
create policy admin_users_select_admin
on public.admin_users
for select
to authenticated
using (public.is_current_user_admin());

drop policy if exists admin_users_insert_admin on public.admin_users;
create policy admin_users_insert_admin
on public.admin_users
for insert
to authenticated
with check (public.is_current_user_admin());

drop policy if exists admin_users_update_admin on public.admin_users;
create policy admin_users_update_admin
on public.admin_users
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists admin_users_delete_admin on public.admin_users;
create policy admin_users_delete_admin
on public.admin_users
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
