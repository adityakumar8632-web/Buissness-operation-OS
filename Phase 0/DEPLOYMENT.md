# Phase 0 — Deployment Guide

**Confirmed configuration:**

| Layer | Service | Tier |
|---|---|---|
| Frontend + API | Vercel | Free |
| Database | Neon (serverless Postgres) | Free |
| Source control | GitHub | Free |

Total cost: $0. This is the configuration used everywhere below —
no local Postgres, no device hosting, no other providers.

This gets the Phase 0 scaffold live on the internet: a Neon Postgres
database + the app running on Vercel, with the login → dashboard →
`/api/org` flow working exactly as it does locally.

Do this only after the local checks in `README.md` pass. Deploying a
broken local setup just moves the debugging online.

---

## 1. Push the code to GitHub

Vercel deploys from a git repo, so it needs to exist there first.

```bash
cd business-ops-os
git init
git add .
git commit -m "Phase 0: identity, tenancy, RBAC foundation"
```

Create an empty repo on GitHub, then:

```bash
git remote add origin https://github.com/<your-username>/business-ops-os.git
git branch -M main
git push -u origin main
```

## 2. Create a Neon Postgres database

1. Go to **neon.tech** → sign up (free) → **Create a project**.
2. Name it `business-ops-os` (or anything).
3. Neon shows a connection string immediately — copy it. It looks like:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
   ```
4. Keep this tab open; you'll paste it into Vercel next.

Note: Neon connection strings require `sslmode=require` — it's included
by default, don't strip it out.

## 3. Import the project into Vercel

1. Go to vercel.com → **Add New → Project**.
2. Select the GitHub repo you just pushed.
3. Framework preset should auto-detect as **Next.js** — leave build settings default.
4. **Before clicking Deploy**, open the **Environment Variables** section and add:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | the Neon connection string from Step 2 |
   | `NEXTAUTH_SECRET` | output of `openssl rand -base64 32` |
   | `NEXTAUTH_URL` | your future Vercel URL, e.g. `https://business-ops-os.vercel.app` (you can edit this after the first deploy once you know the real URL) |

5. Click **Deploy**.

The first deploy will likely fail or serve a broken app at this point —
that's expected, because the database has no schema yet.

## 4. Run the schema migration against Neon

From your local machine (or any machine with Node — this doesn't need to
run on the phone), pointed at the Neon database:

```bash
DATABASE_URL="<paste the Neon connection string from Step 2>" npx prisma migrate deploy
```

Note: `migrate deploy` (not `migrate dev`) — `deploy` applies existing
migrations without prompting or generating new ones, which is the correct
command for any non-local environment.

## 5. Seed the Neon database

```bash
DATABASE_URL="<same Neon string>" npm run db:seed
```

This creates the same two demo orgs (Acme, Northwind) in production. For
a real deployment past Phase 0 you'd replace this with a real signup
flow instead of seeded demo accounts — fine to leave as-is for now since
Phase 0 is about proving the mechanism works.

## 6. Redeploy and fix the callback URL

1. Back in Vercel, go to **Settings → Environment Variables** and set
   `NEXTAUTH_URL` to the actual deployed URL (Vercel shows it at the top
   of the project page, e.g. `https://business-ops-os-xyz.vercel.app`).
2. Trigger a redeploy: **Deployments → ⋯ → Redeploy** (or just push an
   empty commit).

`NEXTAUTH_URL` has to match the real deployed domain — if it's wrong,
login will appear to succeed but the session/cookie won't stick.

## 7. Verify production the same way you verified local

Repeat the four checks from `README.md`, against the live URL instead of
`localhost:3000`:

1. Log in as `owner@acme.test` / `password123` → dashboard shows Acme's org and permissions.
2. Log in as `owner@northwind.test` / `password123` (separate browser/incognito) → shows Northwind only.
3. Visit `/api/org` while signed in as each — response never leaks the other org's data.
4. Visit `/dashboard` signed out → redirected to `/login`, no broken page.

If all four pass on the live URL, Phase 0's "deploy pipeline working" exit
criterion is met.

---

## Common failure points

| Symptom | Likely cause |
|---|---|
| Build fails on Vercel with a Prisma error | `DATABASE_URL` env var missing or malformed in Vercel's settings |
| Login redirects loop or silently fails | `NEXTAUTH_URL` doesn't match the actual deployed domain |
| "Table does not exist" errors | `prisma migrate deploy` wasn't run against Neon, or ran against the wrong `DATABASE_URL` |
| App builds but dashboard is empty/errors | Seed script wasn't run against Neon |
| Connection refused / SSL errors | `sslmode=require` got stripped from the Neon connection string — add it back |
| Works for one org, leaks data for the other | Stop — this means tenant isolation is broken. Don't proceed to Phase 1 until `assertSameOrganization` checks are confirmed working; re-check `src/lib/rbac.ts` usage in every route |

## Next

Once this is live and verified, Phase 1 (CRM, orders, inventory) gets
added to the same repo and deploys through the same pipeline — no new
infrastructure decisions needed, just `git push` triggers a new Vercel
build using the same database.
