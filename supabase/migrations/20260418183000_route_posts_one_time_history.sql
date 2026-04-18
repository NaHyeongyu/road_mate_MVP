alter table public.route_posts
add column if not exists is_active boolean not null default true;

update public.route_posts
set is_active = case
  when kind = 'regular' then true
  when notice_date is null then true
  when notice_date >= current_date then true
  else false
end;

drop index if exists route_posts_owner_kind_key;

create unique index if not exists route_posts_owner_regular_key
  on public.route_posts (owner_user_id)
  where kind = 'regular';

create unique index if not exists route_posts_owner_active_one_time_key
  on public.route_posts (owner_user_id)
  where kind = 'one_time' and is_active = true;

create index if not exists route_posts_owner_kind_active_created_idx
  on public.route_posts (owner_user_id, kind, is_active, created_at desc);
