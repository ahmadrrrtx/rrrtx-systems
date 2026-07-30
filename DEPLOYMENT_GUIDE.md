# RRRTX Systems Production Deployment Guide

## Release prerequisites

- `npm ci` completed from the committed lockfile.
- `npm run check` passes.
- Preview deployment uses an isolated Turso database.
- Production Turso backup and restore procedure has been verified.
- Environment variables are configured separately for Development, Preview, and Production.
- The previous production deployment remains available for rollback.

## Required production environment variables

| Variable | Requirement |
|---|---|
| `TURSO_DATABASE_URL` | Existing production Turso URL |
| `TURSO_AUTH_TOKEN` | Least-privilege production token |
| `ADMIN_EMAIL` | Bootstrap/recovery administrator email |
| `ADMIN_PASSWORD` | Unique password, minimum 12 characters |
| `ADMIN_SESSION_SECRET` | At least 32 cryptographically random characters |
| `NEXT_PUBLIC_GA_ID` | Existing GA4 measurement ID |

Optional lead notification variables are `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `LEAD_NOTIFICATION_EMAIL`. Set `INDEXNOW_KEY` to a unique 8–128 character key to enable automatic Bing/IndexNow notifications after content publishing.

## Database policy

This release does not require a production schema migration.

Never recreate or reset the Turso database. Do not use `drizzle-kit push` against production as part of a normal Vercel build. Future schema changes must use an additive expand–migrate–contract sequence and a tested backup.

## Deployment sequence

1. Deploy the branch to a protected Vercel preview.
2. Run public route, metadata, form, API authorization, and dashboard CRUD smoke tests against preview.
3. Confirm Cloudflare does not block Googlebot, Bingbot, OAI-SearchBot, or PerplexityBot on public routes.
4. Promote the tested deployment to production.
5. Verify `/`, all service routes, blog routes, tools, resources, `/robots.txt`, and `/sitemap.xml`.
6. Sign in to the dashboard using the new signed session and verify read operations before any content edit.
7. Submit one controlled contact-form test and confirm it reaches Turso; verify the optional notification if configured.
8. Inspect GA4 DebugView and Search Console URL Inspection.
9. Monitor server errors, Turso latency, auth failures, and Core Web Vitals.

## Required credential rotation

The previous implementation used a forgeable constant cookie and source-code fallback credentials. Before or immediately after deployment:

1. Set a new `ADMIN_SESSION_SECRET`.
2. Rotate `ADMIN_PASSWORD`.
3. Sign in once with the current database user and change its password through the dashboard.
4. Rotate the Turso token if it has ever been shared outside the production secret store.
5. Remove old preview and developer secrets.

All legacy dashboard cookies become invalid automatically.

## Rollback

- Roll back application code by promoting the previous immutable Vercel deployment.
- Do not roll back to the legacy authentication implementation. If authentication fails, protect the dashboard with maintenance mode while correcting the session configuration.
- No database rollback is required for this release because no production schema migration is included.
- If optional notification delivery fails, form submissions remain stored in Turso; disable notification variables without disabling the forms.
- CSP can temporarily be changed to report-only only if a required production integration is blocked; do not remove the remaining security headers.

## Search follow-up

After deployment, resubmit the sitemap in Google Search Console and Bing Webmaster Tools. Request recrawling for the homepage and six service pages. Search engines may take time to replace the previous homepage canonicals and service `noindex` directives.
