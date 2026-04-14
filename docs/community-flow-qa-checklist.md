# Community Flow QA Checklist

Last updated: 2026-04-13

## Scope
- Rider feed/search/detail/save flow
- Driver regular registration flow
- Driver one-time notice flow (one-way and round-trip)
- Driver profile contact propagation (phone/chat link)
- Visibility and quick settings behavior

## Preconditions
- App launches with a signed-in user
- Supabase route_posts and driver_profiles schema is migrated
- At least one driver account and one rider account are available
- Network on/off can be toggled for fallback checks

## Rider Flow
- [ ] Rider home defaults to regular feed
- [ ] Rider can switch between Regular and Notices tabs
- [ ] Rider can filter feed by Australian state selector (QLD/NSW/VIC/WA/SA/TAS/NT/ACT)
- [ ] Rider search From field shows AU suggestions (QLD/WA/NSW/VIC) and applies selected value
- [ ] Rider search To field shows AU suggestions (QLD/WA/NSW/VIC) and applies selected value
- [ ] Rider search clear button resets each field independently
- [ ] Rider cannot see their own posts in the feed
- [ ] Rider can open post detail and see route information
- [ ] Rider detail shows additional details memo when provided by driver
- [ ] Rider can save and unsave posts from card/detail without errors
- [ ] Saved tab shows only saved posts and updates immediately after save toggle
- [ ] Notices Upcoming scope hides past notices and shows hidden-count helper text
- [ ] Notices All scope includes upcoming and past notices

## Driver Profile & Contact
- [ ] Driver profile supports phone number input
- [ ] Driver profile supports chat link input (WhatsApp/Kakao/Telegram)
- [ ] Driver profile save persists after app restart
- [ ] Profile phone/link is reflected in regular registration preview/card/detail
- [ ] Profile phone/link is reflected in one-time notice preview/card/detail
- [ ] Registration save is blocked when both phone and chat link are empty

## Driver Regular Registration
- [ ] Driver regular draft requires From, To, departure, arrival, operating days, and contact
- [ ] Driver can register first regular route from empty state
- [ ] Re-registering regular route updates existing regular post instead of duplicating
- [ ] Driver can set additional details and see it in preview/detail
- [ ] Seats quick control clamps between 1 and 8
- [ ] Visibility quick control toggles Public/Private and persists
- [ ] Driver overview shows Edit action for existing registration

## Driver One-Time Notice
- [ ] Driver can switch one-time trip type between one-way and round-trip
- [ ] One-way notice does not require return time
- [ ] Round-trip notice requires return time
- [ ] One-time notice can be posted and updated without creating duplicate by kind
- [ ] Additional details memo appears in rider-visible detail
- [ ] Posting one-time notice returns to non-registration page on success

## Cross-Flow Regression
- [ ] Switching mode (Rider/Driver) does not leak stale draft into the wrong flow
- [ ] Back from registration page returns to previous tab safely
- [ ] Saved posts cleanup does not keep own-post keys
- [ ] Removing a route removes it from My posts and Rider feed
- [ ] Quick settings update survives refresh (local + DB path)
- [ ] Offline DB failure path keeps local update and shows error notice once

## Sign-Off
- [ ] iOS manual pass complete
- [ ] Android manual pass complete
- [ ] Web manual pass complete
- [ ] Product owner sign-off complete
