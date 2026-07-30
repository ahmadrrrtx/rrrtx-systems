# RRRTX Systems

Production website, content management system, lead dashboard, resource library, and free tools for RRRTX Systems.

## Architecture

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS
- Turso/libSQL with Drizzle ORM
- Vercel deployment behind Cloudflare
- Server-rendered public pages with CMS-backed content and safe fallbacks
- Signed, expiring administrator sessions
- GA4 page, conversion, and Core Web Vitals events

## Local setup

1. Copy `.env.example` to `.env.local` and provide local-only values.
2. Install exact dependencies with `npm ci`.
3. Create the local schema with `npx drizzle-kit push` against the default local database.
4. Seed optional baseline content only after setting a unique `ADMIN_EMAIL` and an `ADMIN_PASSWORD` of at least 12 characters.
5. Run `npm run dev`.

The local database is intentionally ignored and must never be committed.

## Quality commands

- `npm run lint` — ESLint and Next.js rules
- `npm run typecheck` — strict TypeScript validation
- `npm run test` — unit and security regression tests
- `npm run test:e2e` — mobile/desktop route, metadata, auth, and axe accessibility tests
- `npm run build` — production build
- `npm run check` — complete release gate

## Production safety

- Preview deployments must use a separate Turso database and token.
- Do not run `drizzle-kit push` against production without a reviewed, backed-up migration plan.
- Never restore the legacy constant-value dashboard cookie.
- Rotate `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, and Turso tokens after any suspected exposure.
- Keep the previous Vercel deployment available until public-route and dashboard smoke tests pass.

## Content model

Services, projects, pricing, posts, resources, testimonials, team members, legal content, and homepage settings remain controlled by Turso and the dashboard. Existing hardcoded service and portfolio content is retained only as an availability fallback.

## Search and structured data

Every indexable route owns its canonical, social metadata, and applicable page-level structured data. The sitemap contains only canonical public URLs. Dashboard and API routes emit `noindex` headers.

## License

No license is granted for this production website repository. The separately published Gemma RSS Intelligence Monitor is available under Apache License 2.0 in its own repository.
