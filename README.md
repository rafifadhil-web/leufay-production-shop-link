# LEUFAY LINK SHOPPE

Universal affiliate link storefront for LEUFAY PRODUCTION, built with Next.js and Supabase.

## Setup

1. Create a Supabase project. Run [`supabase/schema.sql`](supabase/schema.sql), then [`supabase/seed.sql`](supabase/seed.sql) in SQL Editor.
2. In Supabase Authentication, create the first email/password user. Add that user's UUID and email to `public.admins` using the commented command in `seed.sql`.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key. `SUPABASE_SERVICE_ROLE_KEY` is optional for this app and must never be exposed to the browser.
4. Add the real logo at `public/images/leufay-logo.png` (the UI currently shows the safe placeholder until that asset is integrated).
5. Install and run: `npm install`, then `npm run dev`.

## Routes

- `/` — public product hub; only `published` products are returned by RLS.
- `/product/[slug]` — product detail and external affiliate CTA.
- `/admin/login` — Supabase email/password login.
- `/admin` — protected dashboard.
- `/admin/products` and `/admin/categories` — mobile-friendly catalog management.

The database policies are the security boundary: client-side UI checks are not relied on for writes. Storage accepts only JPG, PNG, and WEBP files up to 5 MB from authenticated admins.
