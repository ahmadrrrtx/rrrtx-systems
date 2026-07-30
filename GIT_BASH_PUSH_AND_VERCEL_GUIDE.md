# RRRTX Systems — Exact Git Bash PR and Vercel Deployment Guide

Use this guide when you do not have a local repository and want to push the production-ready ZIP to a new branch, run GitHub CI, open a pull request, and merge into `main` safely.

Do not push directly to `main`. Do not force-push. Do not run a production Turso migration.

## What to download

Download this file from the Arena workspace:

```text
rrrtx-systems-production-ready.zip
```

The ZIP contains the complete project snapshot. It excludes `.git`, `node_modules`, `.next`, local databases, and real secrets.

## Prerequisites

Install:

1. Git for Windows, including Git Bash.
2. Node.js 20 LTS.
3. A GitHub account with write access to `ahmadrrrtx/rrrtx-systems`.
4. Access to the RRRTX Systems Vercel project for the later deployment step.

Open Git Bash and verify:

```bash
git --version
node --version
npm --version
```

Node should report version 20.x.

---

# Phase 1 — Extract the ZIP

Put `rrrtx-systems-production-ready.zip` in your Windows Downloads folder.

Open Git Bash and run:

```bash
cd ~/Downloads
rm -rf rrrtx-package
powershell.exe -NoProfile -Command "Expand-Archive -Force 'rrrtx-systems-production-ready.zip' 'rrrtx-package'"
ls -la rrrtx-package/rrrtx-systems
```

You should see files including:

```text
package.json
package-lock.json
src
public
README.md
next.config.ts
GIT_BASH_PUSH_AND_VERCEL_GUIDE.md
```

---

# Phase 2 — Configure Git Identity

Run:

```bash
git config --global user.name "Muhammad Ahmad"
git config --global user.email "YOUR_GITHUB_EMAIL"
```

Replace `YOUR_GITHUB_EMAIL` with the email connected to your GitHub account.

Verify:

```bash
git config --global user.name
git config --global user.email
```

---

# Phase 3 — Clone the Real GitHub Repository

Run:

```bash
cd ~/Downloads
rm -rf rrrtx-systems-github
git clone https://github.com/ahmadrrrtx/rrrtx-systems.git rrrtx-systems-github
cd rrrtx-systems-github
git switch main
git pull --ff-only origin main
```

Verify the remote:

```bash
git remote -v
git status
git rev-parse HEAD
```

The audited base commit was:

```text
70499700166ab9541b9518c1261b600392c63016
```

Run this safety check exactly:

```bash
CURRENT_BASE="$(git rev-parse HEAD)"

if [ "$CURRENT_BASE" != "70499700166ab9541b9518c1261b600392c63016" ]; then
  echo "STOP: GitHub main changed after the audited base commit."
  echo "Do not copy files, commit, force-push, or open the PR yet."
  echo "Current main is: $CURRENT_BASE"
  exit 1
fi
```

If it prints `STOP`, stop and request a merge review using the printed commit hash. Do not use `--force`.

If it prints nothing, continue.

---

# Phase 4 — Create a Pull Request Branch

Create the branch from the latest verified `main`:

```bash
git switch -c rrrtx-production-hardening
```

Verify:

```bash
git branch --show-current
```

Expected:

```text
rrrtx-production-hardening
```

---

# Phase 5 — Replace the Old Working Tree With the ZIP Snapshot

Make sure you are inside:

```text
~/Downloads/rrrtx-systems-github
```

Preserve `.git` and remove the old project files:

```bash
find . -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
```

Copy all package files, including hidden files such as `.github` and `.env.example`:

```bash
cp -R ../rrrtx-package/rrrtx-systems/. .
```

Verify:

```bash
git status --short
```

Many additions, modifications, and deletions are expected. Important expected deletions include:

```text
local.db
src/middleware.ts
src/components/ThreeScene.tsx
old route metadata.ts files
```

Do not restore those deleted files.

---

# Phase 6 — Install and Test Locally

Run:

```bash
node --version
npm --version
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
```

Expected:

```text
ESLint: passed
TypeScript: passed
Unit/security/SEO tests: 9 passed
Next.js production build: passed
```

Optional but strongly recommended browser suite:

```bash
npx playwright install chromium
npm run test:e2e
```

Expected:

```text
10 passed
```

Verify that no secrets or database files will be committed:

```bash
find . -maxdepth 2 -type f \( -name ".env" -o -name ".env.local" -o -name "*.db" \)
```

This command should return nothing. `.env.example` is safe and should remain.

---

# Phase 7 — Review, Stage, and Commit the PR Branch

Run:

```bash
git status
git diff --check
git diff --stat
git add -A
git diff --cached --stat
```

Commit:

```bash
git commit -m "feat: deploy RRRTX production hardening SEO performance and UX"
```

Verify the commit and clean working tree:

```bash
git log -1 --oneline
git status
```

Expected status:

```text
nothing to commit, working tree clean
```

---

# Phase 8 — Push Only the PR Branch

Push the new branch, not `main`:

```bash
git push -u origin rrrtx-production-hardening
```

Git Credential Manager should open a browser. Sign in with the GitHub account that owns or can write to the repository. GitHub account passwords cannot be entered directly as Git passwords.

Verify:

```bash
git branch -vv
git status
git remote -v
```

Do not run this command:

```text
git push --force
```

Do not run `git push origin main` at this stage.

---

# Phase 9 — Open the Pull Request

Open this URL in your browser:

```text
https://github.com/ahmadrrrtx/rrrtx-systems/compare/main...rrrtx-production-hardening?expand=1
```

Use this PR title:

```text
Production hardening: security, SEO, performance, accessibility and CMS
```

Use this PR body:

```text
## Summary
- Replaces forgeable dashboard authentication with signed sessions
- Repairs canonicals, service metadata, schema, sitemap and robots
- Adds case-study routes, FAQ, Open Source, search and IndexNow
- Preserves Turso, CMS, dashboard, forms, APIs and existing URLs
- Adds image, hydration, cache and Core Web Vitals improvements
- Adds loading/error states and WCAG accessibility remediation
- Adds CI, unit, security, SEO, Playwright and axe tests

## Database safety
- No production schema migration required
- No production data reset or seed
- Existing Turso tables and columns are preserved

## Verification
- ESLint passes
- TypeScript passes
- 9 unit/security/SEO tests pass
- 10 browser/accessibility tests pass
- Production build passes
- Mobile Lighthouse: 96 Performance, 100 Accessibility, 100 Best Practices, 100 SEO
```

Click **Create pull request**.

---

# Phase 10 — Wait for CI Checks

Open the PR and select the **Checks** tab.

Required checks should turn green. The included workflow runs:

```text
npm ci
Drizzle schema creation against an isolated CI database
npm run lint
npm run typecheck
npm run test
npm run build
Playwright Chromium tests
axe accessibility tests
```

Do not merge while a required check is pending or red.

If a check fails, click the failed check, open the logs, and copy the first actual error. Do not bypass branch protection.

Optional GitHub CLI commands, only if `gh` is installed:

```bash
gh auth login
gh pr create --base main --head rrrtx-production-hardening --title "Production hardening: security, SEO, performance, accessibility and CMS" --body "Production-safe incremental hardening. No Turso production migration required."
gh pr checks --watch
```

The browser method is completely acceptable if GitHub CLI is not installed.

---

# Phase 11 — Review the Pull Request Before Merge

On the PR Files Changed tab, confirm:

- `local.db` is deleted.
- No `.env` or `.env.local` exists.
- `.env.example` contains placeholders only.
- `src/proxy.ts` exists.
- `.github/workflows/quality.yml` exists.
- `src/app/search/page.tsx` exists.
- `src/app/faq/page.tsx` exists.
- `src/app/open-source/page.tsx` exists.
- `src/lib/session.ts` exists.
- `src/lib/request-security.ts` exists.
- No production Turso URL or token appears in the diff.

Review the PR Conversations tab and resolve genuine review comments before merging.

---

# Phase 12 — Merge the PR Into Main

When all required CI checks are green, use GitHub's **Squash and merge** button unless the repository requires a different merge method.

Recommended squash commit title:

```text
Production hardening: security, SEO, performance, accessibility and CMS
```

Then click **Confirm squash and merge** and **Delete branch**.

Do not use a force merge and do not bypass required checks.

Optional GitHub CLI merge after checks are green:

```bash
gh pr merge rrrtx-production-hardening --squash --delete-branch
```

---

# Phase 13 — Synchronize Git Bash After Merge

Run:

```bash
cd ~/Downloads/rrrtx-systems-github
git switch main
git pull --ff-only origin main
git log -3 --oneline
git status
```

Delete the local PR branch if GitHub did not already clean it up:

```bash
git branch -d rrrtx-production-hardening
```

---

# Phase 14 — Configure Vercel Production Environment

Open the existing RRRTX Systems project in Vercel and go to:

```text
Settings → Environment Variables
```

Required Production variables:

```text
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_SESSION_SECRET
NEXT_PUBLIC_GA_ID
```

Generate a secure session secret in Git Bash:

```bash
openssl rand -hex 32
```

Copy the output to `ADMIN_SESSION_SECRET` in Vercel Production. Never commit it.

Optional variables:

```text
GITHUB_TOKEN
INDEXNOW_KEY
RESEND_API_KEY
RESEND_FROM_EMAIL
LEAD_NOTIFICATION_EMAIL
```

Generate an optional IndexNow key:

```bash
openssl rand -hex 16
```

Production Turso credentials should be selected only for Vercel **Production**. Use an isolated database for Preview. Do not expose production write credentials to PR previews.

---

# Phase 15 — Confirm Vercel Build Settings

Use:

```text
Framework Preset: Next.js
Root Directory: ./
Install Command: npm ci
Build Command: npm run build
Output Directory: .next
Node.js Version: 20.x
Production Branch: main
```

Do not add any of these commands to the Vercel build:

```text
drizzle-kit push
drizzle-kit migrate
npm run seed
```

This release needs no production Turso migration.

If Vercel is already connected to GitHub and `main` is the Production Branch, merging the PR starts the production deployment automatically.

---

# Phase 16 — Verify the Vercel Deployment

Wait until Vercel reports **Ready**.

Run in Git Bash:

```bash
curl -I https://rrrtx-systems.com/
curl -I https://rrrtx-systems.com/services
curl -I https://rrrtx-systems.com/services/ecommerce
curl -I https://rrrtx-systems.com/services/ai-automation
curl -I https://rrrtx-systems.com/services/lead-generation
curl -I https://rrrtx-systems.com/services/rebuilds
curl -I https://rrrtx-systems.com/services/chatbots
curl -I https://rrrtx-systems.com/services/seo
curl -I https://rrrtx-systems.com/blog
curl -I https://rrrtx-systems.com/resources
curl -I https://rrrtx-systems.com/search
curl -I https://rrrtx-systems.com/dashboard/login
curl https://rrrtx-systems.com/robots.txt
curl https://rrrtx-systems.com/sitemap.xml
```

Test a real 404:

```bash
curl -I https://rrrtx-systems.com/services/this-service-does-not-exist
```

Expected status: `404`.

Browser verification:

1. Sign in at `/dashboard/login`.
2. Confirm Leads, Services, Projects, Blog, Pricing, Resources, Team, Testimonials, and Settings load.
3. Submit one controlled contact form.
4. Confirm the lead appears in the dashboard.
5. Test `/audit`, `/roi`, `/search`, `/resources`, and a blog article.
6. Verify all six service pages have correct titles and do not show “Service Not Found.”
7. Test mobile navigation and the automated site guide.

---

# Phase 17 — Search Console and Bing

Submit:

```text
https://rrrtx-systems.com/sitemap.xml
```

Request Google indexing for the homepage, services listing, and six service detail URLs.

Submit the sitemap in Bing Webmaster Tools. If `INDEXNOW_KEY` is configured, future CMS publishing automatically notifies IndexNow.

---

# Rollback

## Vercel rollback

Open **Vercel → Deployments**, select the previous healthy deployment, open its menu, and choose **Promote to Production**.

## Git rollback through a PR

Do not force-reset `main`. Create a revert branch:

```bash
cd ~/Downloads/rrrtx-systems-github
git switch main
git pull --ff-only origin main
git switch -c revert-rrrtx-production-hardening
git log --oneline -5
```

Revert the merged squash commit shown in the log:

```bash
git revert MERGED_COMMIT_HASH
git push -u origin revert-rrrtx-production-hardening
```

Open a rollback PR:

```text
https://github.com/ahmadrrrtx/rrrtx-systems/compare/main...revert-rrrtx-production-hardening?expand=1
```

Wait for CI, review it, and merge the rollback PR.

Do not restore the forgeable legacy authentication. If authentication configuration fails, protect `/dashboard` temporarily with Vercel Deployment Protection or Cloudflare Access, correct the environment variables, and redeploy the hardened release.
