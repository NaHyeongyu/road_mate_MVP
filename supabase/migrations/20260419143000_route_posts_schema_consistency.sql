alter table public.route_posts
  drop constraint if exists route_posts_schedule_format_chk;

alter table public.route_posts
  add constraint route_posts_schedule_format_chk
  check (schedule ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_return_schedule_format_chk;

alter table public.route_posts
  add constraint route_posts_return_schedule_format_chk
  check (return_schedule is null or return_schedule ~ '^([01][0-9]|2[0-3]):[0-5][0-9]$')
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_regular_dates_null_chk;

alter table public.route_posts
  add constraint route_posts_regular_dates_null_chk
  check (kind <> 'regular' or (notice_date is null and return_date is null))
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_one_time_return_date_chk;

alter table public.route_posts
  drop constraint if exists route_posts_one_time_return_pair_chk;

alter table public.route_posts
  add constraint route_posts_one_time_return_pair_chk
  check (
    kind <> 'one_time'
    or (
      (return_schedule is null and return_date is null)
      or (return_schedule is not null and return_date is not null)
    )
  )
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_operating_days_values_chk;

alter table public.route_posts
  add constraint route_posts_operating_days_values_chk
  check (
    operating_days <@ array['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']::text[]
    and cardinality(operating_days) <= 7
    and (kind <> 'regular' or cardinality(operating_days) > 0)
  )
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_note_length_chk;

alter table public.route_posts
  add constraint route_posts_note_length_chk
  check (char_length(note) <= 500)
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_regular_contact_method_chk;

alter table public.route_posts
  add constraint route_posts_regular_contact_method_chk
  check (
    kind <> 'regular'
    or nullif(btrim(coalesce(contact_phone, '')), '') is not null
    or nullif(btrim(coalesce(contact_link, '')), '') is not null
  )
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_regular_active_chk;

alter table public.route_posts
  add constraint route_posts_regular_active_chk
  check (kind <> 'regular' or is_active = true)
  not valid;

drop index if exists route_posts_owner_kind_key;
