alter table public.route_posts
add column if not exists return_date date;

update public.route_posts
set return_date = notice_date
where kind = 'one_time'
  and return_schedule is not null
  and return_date is null;

alter table public.route_posts
  drop constraint if exists route_posts_one_time_return_date_chk;

alter table public.route_posts
  add constraint route_posts_one_time_return_date_chk
  check (kind <> 'one_time' or return_schedule is null or return_date is not null);
