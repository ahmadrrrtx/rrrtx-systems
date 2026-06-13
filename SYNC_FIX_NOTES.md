# RRRTX SYSTEMS — Dashboard ↔ Website Sync Fix

This document explains the fixes applied so that everything added in the admin
dashboard appears on the public website automatically and safely.

## What was broken

1. **Production build was failing.** The homepage (`/`) read the `testimonials`
   table directly during static prerender. The production Turso DB was missing
   the `testimonials`, `team_members`, and `content_pages` tables, so the build
   threw `SQLITE_ERROR: no such table: testimonials` and `/privacy` failed too.
2. **Public pages were hardcoded.** Services, projects (work), and pricing on the
   homepage and on `/services`, `/work`, `/pricing` were static arrays in the
   code. Dashboard edits were saved to the DB but never displayed.
3. **No Team section** existed on the public site even though the dashboard and
   DB supported team members.
4. **Google Analytics (GA4) was not installed** anywhere.
5. **Footer LinkedIn link was `#`** (dead) and pointed nowhere; structured data
   referenced a personal profile, not the company page.
6. **Projects could never be published** from the dashboard — the project form
   had no status control, so every project stayed `draft` and was hidden.

## What was fixed (safe, additive)

- **GA4 installed** via `src/components/GoogleAnalytics.tsx` using the official
  `gtag.js` method, mounted once in `src/app/layout.tsx`. Loads only in
  production. Reads `NEXT_PUBLIC_GA_ID` (falls back to `G-0C94FXCGHH`).
- **Safe data layer** `src/lib/queries.ts`: every public read is wrapped in
  try/catch and returns `[]`/`null` on error, so a missing table or DB hiccup
  can never break the build or the live site again.
- **Public pages now read live DB data** with a fallback to the existing
  hardcoded content when the DB is empty (zero design regression):
  - Homepage services / featured work / pricing
  - `/services`, `/work`, `/pricing`
  - Testimonials section (featured + active)
  - New `Team` section (active members), hidden when empty
- **`export const dynamic = "force-dynamic"`** on the public pages that read the
  DB, so dashboard edits appear immediately on next request.
- **Projects publish flow fixed**: the dashboard project form now has a
  Draft/Published status selector, and the project list has a publish/unpublish
  toggle. Only `published` projects show publicly.
- **LinkedIn company page** wired into the footer (link + icon),
  `StructuredData` `sameAs`, and team member links. Brand icons are inline SVGs
  (`src/components/SocialIcons.tsx`) because `lucide-react@1` removed brand icons.

## Environment variables (set in Vercel → Settings → Environment Variables)

| Variable | Value | Required |
| --- | --- | --- |
| `TURSO_DATABASE_URL` | `libsql://...turso.io` | yes (already set) |
| `TURSO_AUTH_TOKEN` | Turso token | yes (already set) |
| `ADMIN_PASSWORD` | strong admin password | yes (already set) |
| `NEXT_PUBLIC_GA_ID` | `G-0C94FXCGHH` | optional (has fallback) |

No secrets are hardcoded in the source.

## Database migration (run once against production Turso)

Apply `drizzle/0001_add_testimonials_team_content.sql`, or run:

```bash
TURSO_DATABASE_URL="libsql://...turso.io" \
TURSO_AUTH_TOKEN="..." \
npx drizzle-kit push
```

The site/build is resilient and will not crash if you deploy before migrating,
but Team/Testimonials/legal-page editing only work after the tables exist.
