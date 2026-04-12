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
