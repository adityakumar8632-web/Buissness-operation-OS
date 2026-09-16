# Business Operations OS — Phase 0

Identity, tenancy, and access foundation. No business modules yet — this
phase exists to prove that authentication, RBAC, and tenant isolation work
correctly before anything else is built on top of them.

## What's here

- **Next.js 14 (App Router) + TypeScript + Tailwind** frontend/API.
- **PostgreSQL via Prisma**, schema: `Organization`, `User`, `Role`,
  `Permission`, `RolePermission`.
- **NextAuth (credentials)** — email/password login, JWT session carrying
  `organizationId`, `roleName`, and `permissions`.
- **`src/lib/rbac.ts`** — the enforcement helpers every future module route
  should reuse: `requireSession`, `requirePermission`, `assertSameOrganization`.
- **`/api/org`** — the smallest possible protected route, used as the
  reference pattern for every future API route.
- **`/dashboard`** — a protected page that shows the signed-in user's org,
  role, and permissions, so you can visually confirm the whole chain works.
- **Seed script** — creates two demo organizations (Acme, Northwind), all
  five roles from the spec, the full permission set, and one owner login
  per org — specifically so you can prove tenant isolation by hand.

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL** — either a local instance or a free hosted one
   (e.g. Supabase, Neon, Railway). Copy the connection string.

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   Fill in `DATABASE_URL` with your connection string. Generate a
   `NEXTAUTH_SECRET` with:
   ```bash
   openssl rand -base64 32
   ```

4. **Create the database schema**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed demo data**
   ```bash
   npm run db:seed
   ```
   This prints two demo logins, both password `password123`:
   - `owner@acme.test`
   - `owner@northwind.test`

6. **Run the app**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` — you'll be redirected to `/login`.

## How to verify Phase 0 is actually done

This phase isn't "done" because the code compiles — it's done when you can
demonstrate the following by hand:

1. Log in as `owner@acme.test`. The dashboard shows "Acme Retail Co" and
   the owner's full permission list.
2. Sign out, log in as `owner@northwind.test` (use a separate browser
   profile or incognito window if testing both at once). You should see
   "Northwind Traders" and nothing from Acme.
3. Hit `GET /api/org` while signed in as each user — the JSON response
   should only ever contain that user's own organization.
4. Try visiting `/dashboard` while signed out — you should be redirected
   to `/login`, not shown a broken or empty page.

If all four hold, the identity/tenancy/RBAC foundation is solid, and every
later phase (CRM, Orders, Inventory, ...) can build on `lib/rbac.ts` and
the `organizationId` pattern without re-deriving this logic.

## Next: Phase 1

Phase 1 adds `customers, contacts, leads, deals, products, warehouses,
inventory, inventory_movements, sales_orders, order_items` and wires the
first real cross-module event: confirming a sales order reduces inventory
and creates an auditable stock movement record.
