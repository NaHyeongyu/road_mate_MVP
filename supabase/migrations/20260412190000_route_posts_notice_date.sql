alter table public.route_posts
add column if not exists notice_date date;

create index if not exists route_posts_notice_date_created_idx
  on public.route_posts (notice_date desc, created_at desc);
