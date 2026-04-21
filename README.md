# Roadmate

Minimal Expo MVP for a community-style ride board.

Docs:

- `docs/architecture.md`
- `docs/coding-conventions.md`
- `docs/supabase-route-posts.sql`

Scope:

- guest entry without login
- email/password sign-up gate when saving rides or registering/posting as driver
- optional Supabase OAuth quick login (Google / Apple / Facebook / Kakao), disabled by default for release builds
- driver registers one vehicle
- driver posts regular or one-time routes
- rider browses the route list
- route posts are synced to Supabase (`public.route_posts`) with local cache fallback

Run:

```bash
npm install
```

Create or update `.env` with:

```bash
EXPO_PUBLIC_ENABLE_SEED_POSTS=false
EXPO_PUBLIC_ENABLE_ADS=false
EXPO_PUBLIC_ENABLE_IOS_ADS=false
EXPO_PUBLIC_ENABLE_ANDROID_ADS=false
EXPO_PUBLIC_ENABLE_SOCIAL_AUTH=false
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
ADMOB_ANDROID_APP_ID=...
ADMOB_IOS_APP_ID=...
EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID=...
EXPO_PUBLIC_ADMOB_APP_OPEN_UNIT_ID=...
EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID=...
EXPO_PUBLIC_ADMOB_IOS_APP_OPEN_UNIT_ID=...
EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID=...
EXPO_PUBLIC_ADMOB_ANDROID_APP_OPEN_UNIT_ID=...
```

AdMob note:

- The app uses `react-native-google-mobile-ads` (banner + app open ad)
- Ads stay disabled unless `EXPO_PUBLIC_ENABLE_ADS=true`
- Platform-specific flags override the global flag, so production keeps Android ads on with `EXPO_PUBLIC_ENABLE_ANDROID_ADS=true` and iOS ads off with `EXPO_PUBLIC_ENABLE_IOS_ADS=false`
- Use a development build (`npx expo run:android` / `npx expo run:ios`), not Expo Go
- Set the real native AdMob App ID only for platforms where ads are enabled
- Production builds use the Roadmate iOS/Android banner and app-open ad unit IDs in `eas.json`
- Ad requests are configured as non-personalized, iOS app measurement initialization is delayed, and the iOS ATT usage description is omitted because the app does not request tracking permission
- When ads are enabled in development without unit IDs, the app falls back to Google test ad units

OAuth note:

- Social auth stays hidden unless `EXPO_PUBLIC_ENABLE_SOCIAL_AUTH=true`
- Enable `Google`, `Apple`, `Facebook`, and `Kakao` providers in Supabase Auth settings
- Add `roadmate://auth/callback` to Supabase Auth URL configuration (Redirect URLs)

Demo data note:

- Seed route posts stay hidden unless `EXPO_PUBLIC_ENABLE_SEED_POSTS=true`

Run `docs/supabase-route-posts.sql` in Supabase SQL Editor before using community posts.

Then run:

```bash
npm install
npm run sync:native
npm run start
```

Release pipeline note:

- Because `ios/` is checked in, run `npm run sync:native` before store builds so `app.config.js` changes are pushed into native files.
- EAS build profiles are defined in `eas.json`
- Keep EAS environment variables aligned with the same values in local `.env` for remote builds.
- Preview builds: `npm run build:preview:ios` / `npm run build:preview:android`
- Production builds: `npm run build:production:ios` / `npm run build:production:android`
- iOS TestFlight auto-submit: `npm run deploy:ios:testflight`
