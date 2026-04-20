-- Screenshot/demo data only. Uses deterministic IDs and @roadmate.demo emails.

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
values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'screenshot.driver01@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Mina Park"}', now() - interval '15 days', now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'screenshot.driver02@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Daniel Cho"}', now() - interval '14 days', now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000003', 'authenticated', 'authenticated', 'screenshot.driver03@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Haruka Tanaka"}', now() - interval '13 days', now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000004', 'authenticated', 'authenticated', 'screenshot.driver04@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Sophie Martin"}', now() - interval '12 days', now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000005', 'authenticated', 'authenticated', 'screenshot.driver05@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Alex Chen"}', now() - interval '11 days', now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000006', 'authenticated', 'authenticated', 'screenshot.driver06@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Liam Connor"}', now() - interval '10 days', now() - interval '7 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000007', 'authenticated', 'authenticated', 'screenshot.driver07@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Chloe Nguyen"}', now() - interval '9 days', now() - interval '8 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000008', 'authenticated', 'authenticated', 'screenshot.driver08@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Ethan Kim"}', now() - interval '8 days', now() - interval '9 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000009', 'authenticated', 'authenticated', 'screenshot.driver09@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Mei Lin"}', now() - interval '7 days', now() - interval '10 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000010', 'authenticated', 'authenticated', 'screenshot.driver10@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Lucas Brown"}', now() - interval '6 days', now() - interval '11 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000011', 'authenticated', 'authenticated', 'screenshot.driver11@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Aisha Rahman"}', now() - interval '5 days', now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000012', 'authenticated', 'authenticated', 'screenshot.driver12@roadmate.demo', extensions.crypt('RoadmateDemo123!', extensions.gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"name":"Noah Wilson"}', now() - interval '4 days', now() - interval '13 hours')
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
values
  ('10000000-0000-0000-0000-000000000001', 'Toyota Camry Hybrid', 'QLD 842RM', 'Quiet hybrid sedan with room for two cabin bags.', '+61 400 100 001', 'https://wa.me/61400100001', now() - interval '15 days', now() - interval '2 hours'),
  ('10000000-0000-0000-0000-000000000002', 'Hyundai i30', 'QLD 391DC', 'Easy CBD pickup, no smoking, flexible return stops.', '+61 400 100 002', 'https://wa.me/61400100002', now() - interval '14 days', now() - interval '3 hours'),
  ('10000000-0000-0000-0000-000000000003', 'Mazda CX-5', 'NSW 52HTK', 'SUV with child seat available on request.', '+61 400 100 003', 'https://t.me/roadmate_haruka', now() - interval '13 days', now() - interval '4 hours'),
  ('10000000-0000-0000-0000-000000000004', 'Kia Carnival', 'VIC 77SMR', 'Spacious people mover for airport and luggage runs.', '+61 400 100 004', 'https://wa.me/61400100004', now() - interval '12 days', now() - interval '5 hours'),
  ('10000000-0000-0000-0000-000000000005', 'Tesla Model Y', 'QLD EV205', 'EV ride, USB-C charging, quiet cabin.', '+61 400 100 005', 'https://wa.me/61400100005', now() - interval '11 days', now() - interval '6 hours'),
  ('10000000-0000-0000-0000-000000000006', 'Subaru Outback', 'SA 18LCN', 'Good for regional routes and weekend trips.', '+61 400 100 006', 'https://t.me/roadmate_liam', now() - interval '10 days', now() - interval '7 hours'),
  ('10000000-0000-0000-0000-000000000007', 'Toyota RAV4', 'WA 64CNV', 'Comfortable SUV, can stop near Curtin campus.', '+61 400 100 007', 'https://wa.me/61400100007', now() - interval '9 days', now() - interval '8 hours'),
  ('10000000-0000-0000-0000-000000000008', 'Honda Civic', 'QLD 09EKM', 'Reliable weekday commute route.', '+61 400 100 008', 'https://wa.me/61400100008', now() - interval '8 days', now() - interval '9 hours'),
  ('10000000-0000-0000-0000-000000000009', 'MG ZS', 'NSW 27MLN', 'Budget friendly, compact luggage only.', '+61 400 100 009', 'https://t.me/roadmate_mei', now() - interval '7 days', now() - interval '10 hours'),
  ('10000000-0000-0000-0000-000000000010', 'Ford Ranger', 'QLD 45LBR', 'Weekend beach and market runs, tray not used for passengers.', '+61 400 100 010', 'https://wa.me/61400100010', now() - interval '6 days', now() - interval '11 hours'),
  ('10000000-0000-0000-0000-000000000011', 'Nissan X-Trail', 'VIC 31ARH', 'Friendly driver, prefers confirmed pickup points.', '+61 400 100 011', 'https://wa.me/61400100011', now() - interval '5 days', now() - interval '12 hours'),
  ('10000000-0000-0000-0000-000000000012', 'Volkswagen Golf', 'QLD 11NWL', 'Compact city ride, ideal for one or two riders.', '+61 400 100 012', 'https://t.me/roadmate_noah', now() - interval '4 days', now() - interval '13 hours')
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
values
  ('10000000-0000-0000-0000-000000000001:regular', 'regular', true, null, null, 'Brisbane CBD QLD', 'Griffith University Nathan QLD', '08:10', '17:45', 3, array['Mon','Tue','Wed','Thu','Fri']::text[], '+61 400 100 001', 'https://wa.me/61400100001', 'Best pickup is near Queen Street Mall. I can wait up to 5 minutes.', 'Toyota Camry Hybrid', 'QLD 842RM', '10000000-0000-0000-0000-000000000001', 'Mina Park', true, now() - interval '12 days', now() - interval '2 hours'),
  ('10000000-0000-0000-0000-000000000002:regular', 'regular', true, null, null, 'South Brisbane QLD', 'UQ St Lucia QLD', '07:35', '18:10', 2, array['Mon','Tue','Wed','Thu']::text[], '+61 400 100 002', 'https://wa.me/61400100002', 'Morning route crosses West End and Toowong. Good for students.', 'Hyundai i30', 'QLD 391DC', '10000000-0000-0000-0000-000000000002', 'Daniel Cho', true, now() - interval '11 days', now() - interval '3 hours'),
  ('10000000-0000-0000-0000-000000000003:regular', 'regular', true, null, null, 'Sydney Central NSW', 'Macquarie Park NSW', '08:00', '17:30', 4, array['Mon','Wed','Fri']::text[], '+61 400 100 003', 'https://t.me/roadmate_haruka', 'Can stop at Chatswood if requested before departure.', 'Mazda CX-5', 'NSW 52HTK', '10000000-0000-0000-0000-000000000003', 'Haruka Tanaka', true, now() - interval '10 days', now() - interval '4 hours'),
  ('10000000-0000-0000-0000-000000000004:regular', 'regular', true, null, null, 'Melbourne CBD VIC', 'Monash University Clayton VIC', '07:50', '18:20', 5, array['Tue','Wed','Thu','Fri']::text[], '+61 400 100 004', 'https://wa.me/61400100004', 'Large car, plenty of luggage space for airport transfer days.', 'Kia Carnival', 'VIC 77SMR', '10000000-0000-0000-0000-000000000004', 'Sophie Martin', true, now() - interval '9 days', now() - interval '5 hours'),
  ('10000000-0000-0000-0000-000000000005:regular', 'regular', true, null, null, 'Fortitude Valley QLD', 'Brisbane Airport QLD', '06:40', '19:00', 2, array['Mon','Tue','Wed','Thu','Fri','Sat']::text[], '+61 400 100 005', 'https://wa.me/61400100005', 'Airport worker route. Early start, quiet ride, carry-on luggage only.', 'Tesla Model Y', 'QLD EV205', '10000000-0000-0000-0000-000000000005', 'Alex Chen', true, now() - interval '8 days', now() - interval '6 hours'),
  ('10000000-0000-0000-0000-000000000006:regular', 'regular', true, null, null, 'Adelaide CBD SA', 'Mawson Lakes SA', '08:25', '17:40', 3, array['Mon','Tue','Thu']::text[], '+61 400 100 006', 'https://t.me/roadmate_liam', 'Northern suburbs commute, can stop near Prospect.', 'Subaru Outback', 'SA 18LCN', '10000000-0000-0000-0000-000000000006', 'Liam Connor', true, now() - interval '7 days', now() - interval '7 hours'),
  ('10000000-0000-0000-0000-000000000007:regular', 'regular', true, null, null, 'Perth CBD WA', 'Curtin University WA', '07:45', '17:20', 3, array['Mon','Tue','Wed','Thu','Fri']::text[], '+61 400 100 007', 'https://wa.me/61400100007', 'Campus drop-off near library. Message before booking.', 'Toyota RAV4', 'WA 64CNV', '10000000-0000-0000-0000-000000000007', 'Chloe Nguyen', true, now() - interval '6 days', now() - interval '8 hours'),
  ('10000000-0000-0000-0000-000000000008:regular', 'regular', true, null, null, 'Chermside QLD', 'Brisbane CBD QLD', '08:15', '17:55', 2, array['Mon','Wed','Fri']::text[], '+61 400 100 008', 'https://wa.me/61400100008', 'Northside commute with pickup near Westfield bus interchange.', 'Honda Civic', 'QLD 09EKM', '10000000-0000-0000-0000-000000000008', 'Ethan Kim', true, now() - interval '5 days', now() - interval '9 hours'),
  ('10000000-0000-0000-0000-000000000009:regular', 'regular', true, null, null, 'Parramatta NSW', 'Sydney CBD NSW', '07:20', '18:00', 1, array['Tue','Wed','Thu']::text[], '+61 400 100 009', 'https://t.me/roadmate_mei', 'One spare seat, quick city run via M4 when traffic is clear.', 'MG ZS', 'NSW 27MLN', '10000000-0000-0000-0000-000000000009', 'Mei Lin', true, now() - interval '4 days', now() - interval '10 hours'),
  ('10000000-0000-0000-0000-000000000010:regular', 'regular', true, null, null, 'Noosa Heads QLD', 'Maroochydore QLD', '09:00', '16:30', 3, array['Sat','Sun']::text[], '+61 400 100 010', 'https://wa.me/61400100010', 'Weekend coastal route. Can stop at Coolum by request.', 'Ford Ranger', 'QLD 45LBR', '10000000-0000-0000-0000-000000000010', 'Lucas Brown', true, now() - interval '3 days', now() - interval '11 hours')
on conflict (id) do update
set
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
values
  ('10000000-0000-0000-0000-000000000001:one_time:gold-coast', 'one_time', true, current_date + 1, current_date + 1, 'Brisbane CBD QLD', 'Gold Coast Surfers Paradise QLD', '10:30', '20:30', 2, '{}'::text[], '+61 400 100 001', 'https://wa.me/61400100001', 'Day trip to the coast. Return pickup near Cavill Avenue.', 'Toyota Camry Hybrid', 'QLD 842RM', '10000000-0000-0000-0000-000000000001', 'Mina Park', true, now() - interval '3 hours', now() - interval '35 minutes'),
  ('10000000-0000-0000-0000-000000000002:one_time:airport', 'one_time', true, current_date + 1, null, 'South Brisbane QLD', 'Brisbane Airport Domestic QLD', '06:15', null, 1, '{}'::text[], '+61 400 100 002', 'https://wa.me/61400100002', 'Early airport drop-off. Small luggage preferred.', 'Hyundai i30', 'QLD 391DC', '10000000-0000-0000-0000-000000000002', 'Daniel Cho', true, now() - interval '4 hours', now() - interval '40 minutes'),
  ('10000000-0000-0000-0000-000000000003:one_time:newcastle', 'one_time', true, current_date + 2, current_date + 3, 'Sydney Central NSW', 'Newcastle NSW', '09:00', '14:00', 3, '{}'::text[], '+61 400 100 003', 'https://t.me/roadmate_haruka', 'Weekend visit route, flexible stop at Gosford.', 'Mazda CX-5', 'NSW 52HTK', '10000000-0000-0000-0000-000000000003', 'Haruka Tanaka', true, now() - interval '5 hours', now() - interval '45 minutes'),
  ('10000000-0000-0000-0000-000000000004:one_time:airport', 'one_time', true, current_date + 2, null, 'Melbourne CBD VIC', 'Melbourne Airport VIC', '05:45', null, 4, '{}'::text[], '+61 400 100 004', 'https://wa.me/61400100004', 'Airport run with space for suitcases. Pickup near Southern Cross.', 'Kia Carnival', 'VIC 77SMR', '10000000-0000-0000-0000-000000000004', 'Sophie Martin', true, now() - interval '6 hours', now() - interval '50 minutes'),
  ('10000000-0000-0000-0000-000000000005:one_time:sunshine', 'one_time', true, current_date + 3, current_date + 3, 'Brisbane Airport QLD', 'Sunshine Coast QLD', '11:20', '18:40', 2, '{}'::text[], '+61 400 100 005', 'https://wa.me/61400100005', 'EV ride to Sunshine Coast, one charging stop if needed.', 'Tesla Model Y', 'QLD EV205', '10000000-0000-0000-0000-000000000005', 'Alex Chen', true, now() - interval '7 hours', now() - interval '55 minutes'),
  ('10000000-0000-0000-0000-000000000006:one_time:wine', 'one_time', true, current_date + 4, current_date + 4, 'Adelaide CBD SA', 'Barossa Valley SA', '08:30', '17:00', 3, '{}'::text[], '+61 400 100 006', 'https://t.me/roadmate_liam', 'Barossa day route. No alcohol in the car, please.', 'Subaru Outback', 'SA 18LCN', '10000000-0000-0000-0000-000000000006', 'Liam Connor', true, now() - interval '8 hours', now() - interval '1 hour'),
  ('10000000-0000-0000-0000-000000000007:one_time:fremantle', 'one_time', true, current_date + 5, null, 'Perth CBD WA', 'Fremantle WA', '12:10', null, 2, '{}'::text[], '+61 400 100 007', 'https://wa.me/61400100007', 'Lunch run to Fremantle markets. One-way only.', 'Toyota RAV4', 'WA 64CNV', '10000000-0000-0000-0000-000000000007', 'Chloe Nguyen', true, now() - interval '9 hours', now() - interval '70 minutes'),
  ('10000000-0000-0000-0000-000000000008:one_time:byron', 'one_time', true, current_date + 6, current_date + 7, 'Brisbane CBD QLD', 'Byron Bay NSW', '07:00', '15:30', 2, '{}'::text[], '+61 400 100 008', 'https://wa.me/61400100008', 'Overnight Byron trip, return next afternoon.', 'Honda Civic', 'QLD 09EKM', '10000000-0000-0000-0000-000000000008', 'Ethan Kim', true, now() - interval '10 hours', now() - interval '80 minutes'),
  ('10000000-0000-0000-0000-000000000009:one_time:past-city', 'one_time', false, current_date - 5, null, 'Parramatta NSW', 'Sydney CBD NSW', '10:15', null, 1, '{}'::text[], '+61 400 100 009', 'https://t.me/roadmate_mei', 'Past one-way city notice for history screenshots.', 'MG ZS', 'NSW 27MLN', '10000000-0000-0000-0000-000000000009', 'Mei Lin', true, now() - interval '5 days', now() - interval '5 days'),
  ('10000000-0000-0000-0000-000000000010:one_time:past-coast', 'one_time', false, current_date - 12, current_date - 12, 'Noosa Heads QLD', 'Maroochydore QLD', '09:15', '15:45', 2, '{}'::text[], '+61 400 100 010', 'https://wa.me/61400100010', 'Past coastal return notice for previous notice list.', 'Ford Ranger', 'QLD 45LBR', '10000000-0000-0000-0000-000000000010', 'Lucas Brown', true, now() - interval '12 days', now() - interval '12 days'),
  ('10000000-0000-0000-0000-000000000011:one_time:past-ballarat', 'one_time', false, current_date - 28, current_date - 28, 'Melbourne CBD VIC', 'Ballarat VIC', '08:45', '19:15', 3, '{}'::text[], '+61 400 100 011', 'https://wa.me/61400100011', 'Past regional route, useful for admin history screenshots.', 'Nissan X-Trail', 'VIC 31ARH', '10000000-0000-0000-0000-000000000011', 'Aisha Rahman', true, now() - interval '28 days', now() - interval '28 days'),
  ('10000000-0000-0000-0000-000000000012:one_time:past-city', 'one_time', false, current_date - 42, null, 'Brisbane CBD QLD', 'Indooroopilly QLD', '13:20', null, 1, '{}'::text[], '+61 400 100 012', 'https://t.me/roadmate_noah', 'Past short one-way notice.', 'Volkswagen Golf', 'QLD 11NWL', '10000000-0000-0000-0000-000000000012', 'Noah Wilson', true, now() - interval '42 days', now() - interval '42 days')
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

insert into public.support_requests (
  id,
  category,
  status,
  user_id,
  user_email,
  title,
  message,
  admin_note,
  created_at,
  updated_at,
  resolved_at
)
values
  ('20000000-0000-0000-0000-000000000001', 'inquiry', 'open', '10000000-0000-0000-0000-000000000001', 'screenshot.driver01@roadmate.demo', 'Can I add recurring airport rides?', 'I drive to the airport every weekday and want riders to find that route more easily.', '', now() - interval '6 hours', now() - interval '6 hours', null),
  ('20000000-0000-0000-0000-000000000002', 'bug', 'in_progress', null, 'rider.demo01@roadmate.demo', 'Search result did not refresh once', 'After changing destination from Gold Coast to Airport the old cards were still visible until I reopened the tab.', 'Check search cache invalidation on mobile.', now() - interval '1 day', now() - interval '3 hours', null),
  ('20000000-0000-0000-0000-000000000003', 'change_request', 'open', null, 'rider.demo02@roadmate.demo', 'Add filter for luggage space', 'It would help to know if a ride can fit a large suitcase before contacting the driver.', '', now() - interval '2 days', now() - interval '2 days', null),
  ('20000000-0000-0000-0000-000000000004', 'bug', 'resolved', '10000000-0000-0000-0000-000000000004', 'screenshot.driver04@roadmate.demo', 'Return date text was confusing', 'On one-time round trip setup I was not sure if return date was required.', 'Resolved by making return date explicit when round trip is selected.', now() - interval '3 days', now() - interval '1 day', now() - interval '1 day'),
  ('20000000-0000-0000-0000-000000000005', 'inquiry', 'closed', null, 'rider.demo03@roadmate.demo', 'Can guests save rides?', 'I want to save a route before signing up.', 'Closed: saving is account-only for now.', now() - interval '5 days', now() - interval '4 days', now() - interval '4 days'),
  ('20000000-0000-0000-0000-000000000006', 'other', 'open', '10000000-0000-0000-0000-000000000007', 'screenshot.driver07@roadmate.demo', 'Profile photo support', 'Could drivers add a small photo or badge later?', '', now() - interval '7 days', now() - interval '7 days', null)
on conflict (id) do update
set
  category = excluded.category,
  status = excluded.status,
  user_id = excluded.user_id,
  user_email = excluded.user_email,
  title = excluded.title,
  message = excluded.message,
  admin_note = excluded.admin_note,
  updated_at = excluded.updated_at,
  resolved_at = excluded.resolved_at;
