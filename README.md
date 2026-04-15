# roadmate_mvp

Minimal Expo MVP for a community-style ride board.

Docs:

- `docs/architecture.md`
- `docs/coding-conventions.md`
- `docs/supabase-route-posts.sql`

Scope:

- Supabase email/password auth
- Supabase OAuth quick login (Google / Apple / Facebook / Kakao)
- driver registers one vehicle
- driver posts regular or one-time routes
- rider browses the route list
- route posts are synced to Supabase (`public.route_posts`) with local cache fallback

Run:

```bash
npm install
cp .env.example .env
```

Set:

```bash
EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...
EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID=...
EXPO_PUBLIC_ADMOB_APP_OPEN_UNIT_ID=...
```

AdMob note:

- The app uses `react-native-google-mobile-ads` (banner + app open ad)
- Use a development build (`npx expo run:android` / `npx expo run:ios`), not Expo Go
- Replace test app IDs in `app.json` plugin config with your real AdMob app IDs before release

OAuth note:

- Enable `Google`, `Apple`, `Facebook`, and `Kakao` providers in Supabase Auth settings
- Add `roadmate://auth/callback` to Supabase Auth URL configuration (Redirect URLs)

Run `docs/supabase-route-posts.sql` in Supabase SQL Editor before using community posts.

Then run:

```bash
npm install
npm run start
```
