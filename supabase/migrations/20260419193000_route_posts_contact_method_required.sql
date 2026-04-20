alter table public.route_posts
  drop constraint if exists route_posts_contact_method_chk;

alter table public.route_posts
  add constraint route_posts_contact_method_chk
  check (
    nullif(btrim(coalesce(contact_phone, '')), '') is not null
    or nullif(btrim(coalesce(contact_link, '')), '') is not null
  )
  not valid;
