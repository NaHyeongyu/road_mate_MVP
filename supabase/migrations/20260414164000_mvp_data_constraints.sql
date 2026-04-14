alter table public.route_posts
  drop constraint if exists route_posts_one_time_notice_date_chk;

alter table public.route_posts
  add constraint route_posts_one_time_notice_date_chk
  check (kind <> 'one_time' or notice_date is not null)
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_from_location_not_blank_chk;

alter table public.route_posts
  add constraint route_posts_from_location_not_blank_chk
  check (length(btrim(from_location)) > 0)
  not valid;

alter table public.route_posts
  drop constraint if exists route_posts_to_location_not_blank_chk;

alter table public.route_posts
  add constraint route_posts_to_location_not_blank_chk
  check (length(btrim(to_location)) > 0)
  not valid;

alter table public.driver_profiles
  drop constraint if exists driver_profiles_vehicle_model_not_blank_chk;

alter table public.driver_profiles
  add constraint driver_profiles_vehicle_model_not_blank_chk
  check (length(btrim(vehicle_model)) > 0)
  not valid;

alter table public.driver_profiles
  drop constraint if exists driver_profiles_vehicle_plate_not_blank_chk;

alter table public.driver_profiles
  add constraint driver_profiles_vehicle_plate_not_blank_chk
  check (length(btrim(vehicle_plate)) > 0)
  not valid;
