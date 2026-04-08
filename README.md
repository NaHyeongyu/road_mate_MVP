# roadmate_mvp

Minimal Expo MVP for a community-style ride board.

Docs:

- `docs/architecture.md`
- `docs/coding-conventions.md`
- `docs/supabase-route-posts.sql`

Scope:

- Supabase email/password auth
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
```

Run `docs/supabase-route-posts.sql` in Supabase SQL Editor before using community posts.

Then run:

```bash
npm install
npm run start
```
