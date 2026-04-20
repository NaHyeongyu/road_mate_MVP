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
