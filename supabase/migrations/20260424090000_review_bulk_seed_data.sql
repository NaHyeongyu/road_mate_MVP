-- Bulk review/demo data only. Uses deterministic IDs and @roadmate.demo emails.
-- Safe to re-run: public records are upserted by deterministic primary keys.

create temporary table if not exists _roadmate_review_seed_drivers (
  n integer primary key,
  owner_user_id uuid not null,
  email text not null,
  owner_name text not null,
  vehicle_model text not null,
  vehicle_plate text not null,
  vehicle_note text not null,
  contact_phone text not null,
  contact_link text,
  regular_from text not null,
  regular_to text not null,
  regular_schedule text not null,
  regular_return_schedule text not null,
  regular_days text[] not null,
  regular_note text not null,
  notice_from text not null,
  notice_to text not null,
  notice_schedule text not null,
  notice_return_schedule text,
  notice_note text not null,
  past_from text not null,
  past_to text not null,
  past_schedule text not null,
  past_return_schedule text,
  past_note text not null
) on commit drop;

truncate _roadmate_review_seed_drivers;

insert into _roadmate_review_seed_drivers (
  n,
  owner_user_id,
  email,
  owner_name,
  vehicle_model,
  vehicle_plate,
  vehicle_note,
  contact_phone,
  contact_link,
  regular_from,
  regular_to,
  regular_schedule,
  regular_return_schedule,
  regular_days,
  regular_note,
  notice_from,
  notice_to,
  notice_schedule,
  notice_return_schedule,
  notice_note,
  past_from,
  past_to,
  past_schedule,
  past_return_schedule,
  past_note
)
select
  seed.n,
  ('30000000-0000-0000-0000-' || lpad(seed.n::text, 12, '0'))::uuid,
  'review.driver' || lpad(seed.n::text, 2, '0') || '@roadmate.demo',
  catalog.names[seed.n],
  catalog.vehicle_models[((seed.n - 1) % 10) + 1],
  catalog.plate_states[((seed.n - 1) % 8) + 1] || ' R' || lpad(seed.n::text, 3, '0'),
  catalog.vehicle_notes[((seed.n - 1) % 10) + 1],
  '+61 480 300 ' || lpad(seed.n::text, 3, '0'),
  case
    when seed.n % 3 = 0 then 'https://t.me/roadmate_review_' || lpad(seed.n::text, 2, '0')
    else 'https://wa.me/61480300' || lpad(seed.n::text, 3, '0')
  end,
  catalog.regular_from[((seed.n - 1) % 12) + 1],
  catalog.regular_to[((seed.n - 1) % 12) + 1],
  catalog.regular_schedules[((seed.n - 1) % 8) + 1],
  catalog.regular_return_schedules[((seed.n - 1) % 8) + 1],
  case (seed.n - 1) % 5
    when 0 then array['Mon', 'Tue', 'Wed', 'Thu', 'Fri']::text[]
    when 1 then array['Mon', 'Wed', 'Fri']::text[]
    when 2 then array['Tue', 'Thu']::text[]
    when 3 then array['Sat', 'Sun']::text[]
    else array['Mon', 'Tue', 'Thu', 'Fri']::text[]
  end,
  catalog.regular_notes[((seed.n - 1) % 12) + 1] || ' Review seed #' || lpad(seed.n::text, 2, '0') || '.',
  catalog.notice_from[((seed.n - 1) % 12) + 1],
  catalog.notice_to[((seed.n - 1) % 12) + 1],
  catalog.notice_schedules[((seed.n - 1) % 8) + 1],
  case
    when seed.n % 4 = 0 then null
    else catalog.notice_return_schedules[((seed.n - 1) % 8) + 1]
  end,
  catalog.notice_notes[((seed.n - 1) % 12) + 1] || ' Review active notice #' || lpad(seed.n::text, 2, '0') || '.',
  catalog.past_from[((seed.n - 1) % 12) + 1],
  catalog.past_to[((seed.n - 1) % 12) + 1],
  catalog.past_schedules[((seed.n - 1) % 8) + 1],
  case
    when seed.n % 3 = 0 then null
    else catalog.past_return_schedules[((seed.n - 1) % 8) + 1]
  end,
  catalog.past_notes[((seed.n - 1) % 12) + 1] || ' Review past notice #' || lpad(seed.n::text, 2, '0') || '.'
from generate_series(1, 40) as seed(n)
cross join (
  select
    array[
      'Yuna Kim',
      'Chris Walker',
      'Avery Singh',
      'Nora Lee',
      'Tom Nguyen',
      'Grace Patel',
      'Mason Wright',
      'Ivy Chen',
      'Leo Martin',
      'Hana Suzuki',
      'Owen Taylor',
      'Mia Brown',
      'Kai Thompson',
      'Sarah Lim',
      'Henry Wilson',
      'Emily Carter',
      'Jin Park',
      'Ruby Harris',
      'Nathan Scott',
      'Olivia Davis',
      'Ben Cooper',
      'Sofia Garcia',
      'Daniel Evans',
      'Emma Clarke',
      'Ryan Mitchell',
      'Amelia Young',
      'Noah Lewis',
      'Ella Turner',
      'Luke Robinson',
      'Chloe White',
      'Oscar Hall',
      'Aisha Khan',
      'Liam Johnson',
      'Zoe King',
      'Arjun Rao',
      'Claire Adams',
      'Finn Roberts',
      'Maya Brooks',
      'Jack Nelson',
      'Sienna Hill'
    ]::text[] as names,
    array[
      'Toyota Corolla Hybrid',
      'Hyundai Kona',
      'Mazda CX-5',
      'Kia Sportage',
      'Tesla Model 3',
      'Nissan X-Trail',
      'Honda Civic',
      'Subaru Forester',
      'Toyota RAV4',
      'Volkswagen Golf'
    ]::text[] as vehicle_models,
    array['QLD', 'NSW', 'VIC', 'SA', 'WA', 'ACT', 'TAS', 'NT']::text[] as plate_states,
    array[
      'Clean commuter car with phone charging available.',
      'Compact ride, best for one or two riders with light bags.',
      'SUV with flexible pickup near major stations.',
      'Reliable daily commute car with quiet cabin.',
      'EV ride with USB-C charging and small luggage space.',
      'Regional route car, comfortable for longer trips.',
      'City ride with simple public pickup points.',
      'Spacious wagon, suitable for campus and office commutes.',
      'Hybrid SUV with room for backpacks and carry-ons.',
      'Compact hatch, fast pickup and drop-off windows.'
    ]::text[] as vehicle_notes,
    array[
      'Brisbane CBD QLD',
      'South Brisbane QLD',
      'Toowong QLD',
      'Chermside QLD',
      'Sunnybank QLD',
      'Gold Coast QLD',
      'Ipswich QLD',
      'Logan Central QLD',
      'Melbourne CBD VIC',
      'Sydney Central NSW',
      'Perth CBD WA',
      'Adelaide CBD SA'
    ]::text[] as regular_from,
    array[
      'UQ St Lucia QLD',
      'Brisbane Airport QLD',
      'Fortitude Valley QLD',
      'Brisbane CBD QLD',
      'Griffith University Nathan QLD',
      'Brisbane CBD QLD',
      'Springfield Central QLD',
      'Mount Gravatt QLD',
      'Monash University Clayton VIC',
      'Macquarie Park NSW',
      'Curtin University WA',
      'Mawson Lakes SA'
    ]::text[] as regular_to,
    array['05:55', '06:20', '06:45', '07:10', '07:35', '08:00', '08:25', '08:50']::text[] as regular_schedules,
    array['15:45', '16:15', '16:45', '17:15', '17:45', '18:15', '18:45', '19:15']::text[] as regular_return_schedules,
    array[
      'Regular weekday commute with pickup at public meeting points.',
      'Airport worker route with room for small luggage.',
      'Inner-city transfer route, short waiting window.',
      'Northside city route, message before the first pickup.',
      'Campus route for repeat riders and fixed schedules.',
      'Intercity commuter run with early departure.',
      'West corridor route with one optional stop.',
      'Southside work commute with reliable timing.',
      'University route with evening return available.',
      'Business park commute with station pickup.',
      'Campus commute with simple drop-off point.',
      'Northern suburbs route with fixed return time.'
    ]::text[] as regular_notes,
    array[
      'Brisbane CBD QLD',
      'Brisbane Airport QLD',
      'South Bank QLD',
      'St Lucia QLD',
      'Fortitude Valley QLD',
      'Chermside QLD',
      'Sunnybank QLD',
      'Ipswich QLD',
      'Melbourne CBD VIC',
      'Sydney Central NSW',
      'Perth CBD WA',
      'Adelaide CBD SA'
    ]::text[] as notice_from,
    array[
      'Sunshine Coast QLD',
      'Gold Coast QLD',
      'Byron Bay NSW',
      'Noosa Heads QLD',
      'Toowoomba QLD',
      'Brisbane Airport QLD',
      'Gold Coast Airport QLD',
      'Brisbane CBD QLD',
      'Geelong VIC',
      'Wollongong NSW',
      'Fremantle WA',
      'Barossa Valley SA'
    ]::text[] as notice_to,
    array['04:50', '06:10', '07:25', '09:00', '11:30', '13:45', '16:20', '18:40']::text[] as notice_schedules,
    array['12:30', '14:15', '15:40', '17:20', '18:50', '20:10', '21:35', '22:20']::text[] as notice_return_schedules,
    array[
      'One-time trip for a day run with flexible pickup.',
      'Airport or station transfer with small luggage preferred.',
      'Weekend coastal trip with one planned comfort stop.',
      'Short notice route, public pickup only.',
      'Regional run, please confirm luggage before departure.',
      'Early pickup available near the bus interchange.',
      'Airport transfer, carry-on luggage works best.',
      'City return route with a quick drop-off window.',
      'Regional day trip, return time can be confirmed by chat.',
      'Coastal route, direct drop-off near the main station.',
      'Market day trip, one-way riders also welcome.',
      'Day tour route, confirm pickup point before booking.'
    ]::text[] as notice_notes,
    array[
      'Brisbane CBD QLD',
      'South Brisbane QLD',
      'Gold Coast QLD',
      'Noosa Heads QLD',
      'Toowoomba QLD',
      'Sydney Central NSW',
      'Melbourne CBD VIC',
      'Perth CBD WA',
      'Adelaide CBD SA',
      'Cairns CBD QLD',
      'Townsville CBD QLD',
      'Hobart CBD TAS'
    ]::text[] as past_from,
    array[
      'Indooroopilly QLD',
      'Brisbane Airport QLD',
      'Brisbane CBD QLD',
      'Maroochydore QLD',
      'Brisbane Airport QLD',
      'Parramatta NSW',
      'Ballarat VIC',
      'Fremantle WA',
      'Glenelg SA',
      'Cairns Airport QLD',
      'Magnetic Island Ferry QLD',
      'Launceston TAS'
    ]::text[] as past_to,
    array['05:15', '07:05', '08:30', '10:20', '12:45', '15:00', '17:10', '19:25']::text[] as past_schedules,
    array['11:45', '13:30', '14:55', '16:10', '18:35', '20:25', '21:50', '22:40']::text[] as past_return_schedules,
    array[
      'Past notice kept for previous notice review screens.',
      'Past airport transfer for history list testing.',
      'Past intercity route with completed status.',
      'Past coastal trip for all-notice filtering.',
      'Past regional run for admin and driver history.',
      'Past city commute to verify inactive records.',
      'Past university route for previous notice list.',
      'Past evening pickup for notice scope testing.',
      'Past weekend ride with return information.',
      'Past airport run for date filter coverage.',
      'Past ferry transfer route.',
      'Past long-distance route for review data.'
    ]::text[] as past_notes
) as catalog;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
select
  '00000000-0000-0000-0000-000000000000',
  owner_user_id,
  'authenticated',
  'authenticated',
  email,
  extensions.crypt('RoadmateReview123!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object('name', owner_name),
  now() - ((60 - n) * interval '1 day'),
  now() - (n * interval '15 minutes')
from _roadmate_review_seed_drivers
on conflict (id) do update
set
  email = excluded.email,
  raw_user_meta_data = excluded.raw_user_meta_data,
  updated_at = now();

insert into public.driver_profiles (
  owner_user_id,
  vehicle_model,
  vehicle_plate,
  vehicle_note,
  contact_phone,
  contact_link,
  created_at,
  updated_at
)
select
  owner_user_id,
  vehicle_model,
  vehicle_plate,
  vehicle_note,
  contact_phone,
  contact_link,
  now() - ((50 - n) * interval '1 day'),
  now() - (n * interval '10 minutes')
from _roadmate_review_seed_drivers
on conflict (owner_user_id) do update
set
  vehicle_model = excluded.vehicle_model,
  vehicle_plate = excluded.vehicle_plate,
  vehicle_note = excluded.vehicle_note,
  contact_phone = excluded.contact_phone,
  contact_link = excluded.contact_link,
  updated_at = now();

insert into public.route_posts (
  id,
  kind,
  is_active,
  notice_date,
  return_date,
  from_location,
  to_location,
  schedule,
  return_schedule,
  available_seats,
  operating_days,
  contact_phone,
  contact_link,
  note,
  vehicle_model,
  vehicle_plate,
  owner_user_id,
  owner_name,
  is_public,
  created_at,
  updated_at
)
select
  owner_user_id::text || ':regular',
  'regular',
  true,
  null,
  null,
  regular_from,
  regular_to,
  regular_schedule,
  regular_return_schedule,
  1 + (n % 4),
  regular_days,
  contact_phone,
  contact_link,
  regular_note,
  vehicle_model,
  vehicle_plate,
  owner_user_id,
  owner_name,
  true,
  now() - ((80 - n) * interval '2 hours'),
  now() - (n * interval '6 minutes')
from _roadmate_review_seed_drivers
on conflict (id) do update
set
  is_active = excluded.is_active,
  from_location = excluded.from_location,
  to_location = excluded.to_location,
  schedule = excluded.schedule,
  return_schedule = excluded.return_schedule,
  available_seats = excluded.available_seats,
  operating_days = excluded.operating_days,
  contact_phone = excluded.contact_phone,
  contact_link = excluded.contact_link,
  note = excluded.note,
  vehicle_model = excluded.vehicle_model,
  vehicle_plate = excluded.vehicle_plate,
  owner_name = excluded.owner_name,
  is_public = excluded.is_public,
  updated_at = now();

insert into public.route_posts (
  id,
  kind,
  is_active,
  notice_date,
  return_date,
  from_location,
  to_location,
  schedule,
  return_schedule,
  available_seats,
  operating_days,
  contact_phone,
  contact_link,
  note,
  vehicle_model,
  vehicle_plate,
  owner_user_id,
  owner_name,
  is_public,
  created_at,
  updated_at
)
select
  owner_user_id::text || ':one_time:review-active',
  'one_time',
  true,
  current_date + ((n % 14) + 1),
  case
    when notice_return_schedule is null then null
    else current_date + ((n % 14) + 1) + case when n % 5 = 0 then 1 else 0 end
  end,
  notice_from,
  notice_to,
  notice_schedule,
  notice_return_schedule,
  1 + (n % 4),
  '{}'::text[],
  contact_phone,
  contact_link,
  notice_note,
  vehicle_model,
  vehicle_plate,
  owner_user_id,
  owner_name,
  true,
  now() - (n * interval '45 minutes'),
  now() - (n * interval '5 minutes')
from _roadmate_review_seed_drivers
on conflict (id) do update
set
  is_active = excluded.is_active,
  notice_date = excluded.notice_date,
  return_date = excluded.return_date,
  from_location = excluded.from_location,
  to_location = excluded.to_location,
  schedule = excluded.schedule,
  return_schedule = excluded.return_schedule,
  available_seats = excluded.available_seats,
  contact_phone = excluded.contact_phone,
  contact_link = excluded.contact_link,
  note = excluded.note,
  vehicle_model = excluded.vehicle_model,
  vehicle_plate = excluded.vehicle_plate,
  owner_name = excluded.owner_name,
  is_public = excluded.is_public,
  updated_at = now();

insert into public.route_posts (
  id,
  kind,
  is_active,
  notice_date,
  return_date,
  from_location,
  to_location,
  schedule,
  return_schedule,
  available_seats,
  operating_days,
  contact_phone,
  contact_link,
  note,
  vehicle_model,
  vehicle_plate,
  owner_user_id,
  owner_name,
  is_public,
  created_at,
  updated_at
)
select
  owner_user_id::text || ':one_time:review-past',
  'one_time',
  false,
  current_date - ((n % 45) + 1),
  case
    when past_return_schedule is null then null
    else current_date - ((n % 45) + 1)
  end,
  past_from,
  past_to,
  past_schedule,
  past_return_schedule,
  1 + ((n + 1) % 4),
  '{}'::text[],
  contact_phone,
  contact_link,
  past_note,
  vehicle_model,
  vehicle_plate,
  owner_user_id,
  owner_name,
  true,
  now() - (((n % 45) + 1) * interval '1 day'),
  now() - (((n % 45) + 1) * interval '1 day')
from _roadmate_review_seed_drivers
on conflict (id) do update
set
  is_active = excluded.is_active,
  notice_date = excluded.notice_date,
  return_date = excluded.return_date,
  from_location = excluded.from_location,
  to_location = excluded.to_location,
  schedule = excluded.schedule,
  return_schedule = excluded.return_schedule,
  available_seats = excluded.available_seats,
  contact_phone = excluded.contact_phone,
  contact_link = excluded.contact_link,
  note = excluded.note,
  vehicle_model = excluded.vehicle_model,
  vehicle_plate = excluded.vehicle_plate,
  owner_name = excluded.owner_name,
  is_public = excluded.is_public,
  updated_at = excluded.updated_at;
