# RRRTX SYSTEMS — Complete Deployment Guide

## Phase 1: GitHub Repository Setup

### Step 1.1: Create the GitHub Repo
1. Go to https://github.com/new
2. **Repository name:** `rrrtx-systems` (or whatever you want)
3. **Visibility:** Public (recommended — shows you're open, builds trust)
4. **Initialize:** Do NOT add README, .gitignore, or license (we already have these)
5. Click **Create repository**

### Step 1.2: Push Your Code
```bash
# Navigate to your project folder
cd /home/user/rrrtx-systems

# Initialize git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial production build — RRRTX SYSTEMS v1.0"

# Add your GitHub remote (replace with your actual username)
git remote add origin https://github.com/YOUR_USERNAME/rrrtx-systems.git

# Push to main branch
git branch -M main
git push -u origin main
```

### Step 1.3: Verify on GitHub
- Go to `https://github.com/YOUR_USERNAME/rrrtx-systems`
- You should see all 58 source files, 12 public assets, and this deployment guide

---

## Phase 2: Turso Database (Free Tier)

Turso has a **generous free tier** — 500 databases, 9GB storage, 1 billion row reads/month.

### Step 2.1: Install Turso CLI
```bash
# macOS/Linux
curl -sSfL https://get.turso.tech | bash

# Or install via Homebrew (macOS)
brew install tursodatabase/tap/turso

# Login
turso auth login
```

### Step 2.2: Create Database
```bash
# Create the database
turso db create rrrtx-systems

# Get the connection URL
turso db show rrrtx-systems
# Output will show something like:
# libsql://rrrtx-systems-YOUR_USERNAME.turso.io

# Create an auth token
turso db tokens create rrrtx-systems
# Copy this token — it looks like:
# eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9...
```

### Step 2.3: Push Schema + Seed Data
```bash
# Set environment variables temporarily
export TURSO_DATABASE_URL="libsql://rrrtx-systems-YOUR_USERNAME.turso.io"
export TURSO_AUTH_TOKEN="your-token-from-above"

# Push schema (creates all tables)
npx drizzle-kit push

# Seed admin user + services + pricing + sample lead
npx tsx src/lib/seed.ts

# Verify
turso db shell rrrtx-systems
# Then run: SELECT * FROM services;
# You should see 6 rows. Type .quit to exit.
```

---

## Phase 3: Vercel Deployment (Free Tier)

Vercel's free tier includes:
- **Unlimited** static site hosting
- **1TB** bandwidth/month
- **Serverless Functions** — 100GB-hours/month (more than enough)
- **Free SSL** (automatic)
- **Free preview deployments** for every push

### Step 3.1: Connect GitHub to Vercel
1. Go to https://vercel.com/new
2. Click **Import Git Repository**
3. Select your `rrrtx-systems` repo
4. Vercel auto-detects Next.js — confirm the settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)

### Step 3.2: Add Environment Variables
Before hitting Deploy, add these in Vercel's dashboard:

| Variable | Value | Required |
|---|---|---|
| `TURSO_DATABASE_URL` | `libsql://rrrtx-systems-YOUR_USERNAME.turso.io` | ✅ Yes |
| `TURSO_AUTH_TOKEN` | Your token from Step 2.2 | ✅ Yes |
| `ADMIN_EMAIL` | Your admin email | ✅ Yes |
| `ADMIN_PASSWORD` | Strong password (min 12 chars) | ✅ Yes |
| `GITHUB_TOKEN` | Optional — for GitHub API rate limits | ❌ No |

**How to add:**
- In Vercel project → Settings → Environment Variables
- Add each one, select **Production** + **Preview** environments

### Step 3.3: Deploy
1. Click **Deploy**
2. Vercel builds (~2-3 minutes for first deploy)
3. You get a URL like: `https://rrrtx-systems-xyz123.vercel.app`

### Step 3.4: Free Domain Strategy (Early Stages)

**YES — you can absolutely use Vercel's free domain in early stages.**

| Stage | Domain | When to Switch |
|---|---|---|
| **MVP / Testing** | `rrrtx-systems.vercel.app` | First 1-2 weeks |
| **Client Outreach** | `rrrtx-systems.vercel.app` | Still fine — looks professional |
| **Production / Paid Ads** | Custom domain `rrrtx.com` | When you start spending on ads |

**Why free domain is fine early:**
- Vercel domains are fast (global CDN)
- SSL is automatic
- No "cheap" perception — many startups use `.vercel.app` initially
- Your work (Janjua Sports, Gemma Agent) proves credibility more than the URL

**When to buy custom domain:**
- Before running Google Ads or Meta Ads (ad platforms prefer custom domains)
- Before sending cold emails to enterprise clients
- When you want email like `hello@rrrtx.com`

**Recommended domains to buy:**
- `rrrtx.com` — brand match, short, memorable
- `rrrtx.systems` — matches your brand name exactly
- `rrrtx.studio` — if you want "studio" positioning
- Buy from: Namecheap, Cloudflare Registrar, or Google Domains

### Step 3.5: Connect Custom Domain (When Ready)
1. Buy domain (Namecheap/Cloudflare)
2. In Vercel → Project → Settings → Domains → Add Domain
3. Vercel gives you DNS records (A record + CNAME)
4. Paste those into your domain registrar's DNS panel
5. Wait 5-60 minutes for propagation
6. Vercel auto-provisions SSL

---

## Phase 4: Update Environment Variables for Production

After first deploy, go to Vercel Dashboard → Your Project → Settings → Environment Variables:

1. **Update `NEXT_PUBLIC_SITE_URL`**
   - Before custom domain: `https://rrrtx-systems-xyz123.vercel.app`
   - After custom domain: `https://rrrtx.com`

2. **Redeploy** (Settings → General → Redeploy)

---

## Phase 5: All Profiles You Need to Create

### 5.1 Essential (Do These First)

| Platform | Profile Name | URL Pattern | Why |
|---|---|---|---|
| **GitHub** | `ahmadrrrtx` (already have) | github.com/ahmadrrrtx | Shows code, builds trust, Agent repo is proof |
| **Vercel** | Your personal account | vercel.com/dashboard | Deployment + hosting |
| **Turso** | Your account | turso.tech | Database |
| **LinkedIn** | **RRRTX SYSTEMS** (company page) | linkedin.com/company/rrrtx-systems | **CRITICAL for B2B credibility** |
| **LinkedIn** | Your personal profile | linkedin.com/in/YOUR_NAME | Founder credibility, post updates |

### 5.2 LinkedIn — Two Profiles Required

**A) Personal Profile (You Already Have)**
- Add "Founder, RRRTX SYSTEMS" to your headline
- Add experience: "RRRTX SYSTEMS — Custom Ecommerce & AI Systems"
- Link to your website in contact info
- Pin your best posts (Janjua Sports launch, Gemma Agent)

**B) Company Page (CREATE THIS — Required for B2B)**
1. Go to https://linkedin.com/company/new
2. **Company name:** RRRTX SYSTEMS
3. **LinkedIn public URL:** `rrrtx-systems`
4. **Website:** Your Vercel URL (update later to custom domain)
5. **Industry:** Software Development / Information Technology
6. **Company size:** 1-10 employees (solo founder + contractors)
7. **Company type:** Self-employed / Partnership
8. **Logo:** Use your `rrrtx-logo.png`
9. **Tagline:** "Custom ecommerce & AI systems built to convert"
10. **Description:** Use your About page copy

**Why company page matters:**
- B2B clients check LinkedIn before hiring
- LinkedIn Company Pages rank on Google for "[your name] + agency"
- You can run LinkedIn ads from a company page
- Employees/clients can tag you, building social proof

### 5.3 Recommended (Create Within First Month)

| Platform | Handle | Purpose | Priority |
|---|---|---|---|
| **Twitter/X** | `@rrrtx_systems` | Share builds, thoughts, attract dev clients | Medium |
| **Dribbble** | `rrrtx` | Portfolio of web designs | Low (designer clients only) |
| **Behance** | `rrrtx-systems` | Case studies with visuals | Medium |
| **Product Hunt** | — | Launch your AI agent or tools | Medium (when you have a product) |
| **Indie Hackers** | Your personal account | Share journey, get feedback | Medium |
| **Crunchbase** | — | Company profile for investor/corporate visibility | Low |

### 5.4 Optional (Nice to Have)

| Platform | Purpose | When |
|---|---|---|
| **Clutch.co** | Agency reviews platform | After 3+ client reviews |
| **GoodFirms** | Agency directory | After 5+ projects |
| **DesignRush** | Agency listing | When you want inbound leads |
| **Trustpilot** | Reviews | After 10+ clients |

---

## Phase 6: Google Search Console & SEO Verification

### Step 6.1: Add Your Site to Google Search Console
1. Go to https://search.google.com/search-console
2. Click **Add Property** → **URL prefix**
3. Enter: `https://rrrtx-systems-xyz123.vercel.app` (or your custom domain)
4. Choose **HTML tag** verification method
5. Copy the meta tag: `<meta name="google-site-verification" content="ABC123..." />`
6. Replace `YOUR_GOOGLE_VERIFICATION` in `src/app/layout.tsx` with this code
7. Push to GitHub → Vercel auto-redeploys
8. Click **Verify** in Search Console

### Step 6.2: Submit Sitemap
1. In Search Console → Sitemaps
2. Submit: `https://your-url.com/sitemap.xml`
3. Google will index your pages within 24-72 hours

### Step 6.3: Google Analytics (Free)
1. Go to https://analytics.google.com
2. Create property → Web stream
3. Copy Measurement ID (looks like `G-XXXXXXXXXX`)
4. Add to your project (optional for now — can add later)

---

## Phase 7: Post-Deployment Checklist

### Immediate (First 24 Hours)
- [ ] Deploy successful on Vercel
- [ ] Homepage loads, hero renders, Three.js works
- [ ] Contact form submits to Turso database
- [ ] Admin login works at `/dashboard/login`
- [ ] Dashboard shows the seeded sample lead
- [ ] All 6 service pages load (`/services/ecommerce`, etc.)
- [ ] Mobile menu works on phone
- [ ] No console errors in browser DevTools

### Week 1
- [ ] Create LinkedIn Company Page
- [ ] Add Vercel URL to GitHub profile README
- [ ] Submit sitemap to Google Search Console
- [ ] Test contact form with real email → check dashboard
- [ ] Add 1 real portfolio project via dashboard
- [ ] Share launch post on LinkedIn personal + company page

### Week 2-4
- [ ] Buy custom domain (when ready)
- [ ] Connect domain to Vercel
- [ ] Update `NEXT_PUBLIC_SITE_URL` env var
- [ ] Add Google Analytics
- [ ] Set up email notifications for new leads (Resend/Loops)
- [ ] First blog post: "How I Built Janjua Sports with Next.js"
- [ ] Apply to 3 freelance platforms (Upwork, Toptal, Contra)

---

## Phase 8: Lead Notification Setup (Email Alerts)

When someone submits your contact form, you want an email. Here's how:

### Option A: Resend (Free — 100 emails/day)
1. Sign up at https://resend.com
2. Get API key
3. Add to Vercel env: `RESEND_API_KEY=...`
4. Modify `/api/leads/route.ts` to send email after insert

### Option B: Loops (Free — 2,000 emails/month)
1. Sign up at https://loops.so
2. Better for transactional + marketing emails
3. API key in env vars

### Option C: Simple Webhook (Free)
1. Use https://zapier.com or https://make.com
2. Webhook URL in env vars
3. POST to webhook when lead arrives

---

## Phase 9: Cost Breakdown (Monthly)

| Service | Free Tier | Paid (When Needed) | Notes |
|---|---|---|---|
| **Vercel** | $0 | $20/mo (Pro) | Free tier is enough for 6+ months |
| **Turso** | $0 | $9/mo (Scaler) | Free: 500 DBs, 9GB, 1B row reads |
| **Domain** | $0 (Vercel subdomain) | $10-15/year | Namecheap/Cloudflare |
| **Email** | $0 | $5/mo (Zoho/Google) | Use free Zoho Mail initially |
| **GitHub** | $0 | $4/mo (Pro) | Free is enough |
| **Resend** | $0 (100/day) | $20/mo | Only needed for notifications |
| **LinkedIn** | $0 | $0 | Company page is free |
| **Analytics** | $0 (GA4) | $0 | Google Analytics is free |
| **TOTAL** | **$0/month** | **~$35/month** | Run free for 3-6 months |

---

## Phase 10: Quick Reference Commands

```bash
# After any code change
git add .
git commit -m "fix: description of change"
git push origin main
# Vercel auto-deploys in ~60 seconds

# Database schema change
npx drizzle-kit push

# Database reset (careful — deletes all data)
# rm local.db && npx drizzle-kit push && npx tsx src/lib/seed.ts

# Check health
curl https://your-url.com/api/health

# View logs
vercel logs your-project-name --production
```

---

## Final Notes

### Your Free Domain Is Fine
Don't waste money on a custom domain before you have:
- 3+ case studies on your site
- 1 paying client
- A reason to run ads

The Vercel subdomain (`something.vercel.app`) is fast, secure, and professional enough for early outreach. Your **portfolio** (Janjua Sports, Gemma Agent) proves your credibility more than a $10 domain.

### LinkedIn Company Page = Required
For B2B agency work, **not having a LinkedIn company page looks suspicious**. Create it today. It takes 10 minutes. It helps with:
- Google search results for "RRRTX SYSTEMS"
- Client due diligence
- LinkedIn messaging (people trust company pages more than personal profiles for business)
- Running LinkedIn ads later

### One Repo, One Database, One Dashboard
Your entire business runs from:
- **GitHub:** Code + asset storage
- **Vercel:** Hosting + serverless functions
- **Turso:** Database (leads, projects, services)
- **Dashboard:** `/dashboard` on your own site

No third-party CRM needed. No SaaS subscriptions. You own everything.

---

**Ready to deploy?** Start with Step 1.1 (create GitHub repo) and work down. Total time: **30-45 minutes** for first deploy.
