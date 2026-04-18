create extension if not exists pg_trgm;

create index if not exists route_posts_from_location_trgm_idx
  on public.route_posts
  using gin (from_location gin_trgm_ops);

create index if not exists route_posts_to_location_trgm_idx
  on public.route_posts
  using gin (to_location gin_trgm_ops);
