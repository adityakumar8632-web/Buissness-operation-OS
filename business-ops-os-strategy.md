# Business Operations OS — Deployment Strategy

## 1. The Problem, Sharpened

Most small-to-mid businesses run on **disconnected tools that don't share state**:

- Inventory lives in a spreadsheet.
- Orders arrive by email or WhatsApp.
- The CRM (if one exists) doesn't know an order was placed.
- Accounting is a separate system nobody else can see.
- Approvals happen on paper or in chat threads with no record.

The failure mode isn't "the tools are bad" — it's that **no single event updates the rest of the business**. A sale doesn't automatically reduce stock. A low-stock condition doesn't automatically create a purchase task. An overdue invoice doesn't automatically alert finance. Every connection between these facts has to be made *manually, by a human, remembering to do it*. That's where businesses lose money, miss follow-ups, and lose customer trust.

**The core problem to solve:** give a business one operational layer where a single business event (e.g., "order confirmed") correctly and automatically propagates through every module it touches — inventory, finance, notifications, analytics — instead of living as an isolated record in one app.

This reframes the project from "build a CRUD dashboard" to **"build a system of record with an event-propagation spine."** Everything in the build plan below exists to prove that spine works before anything else is added.

## 2. What We Are Building (and Deliberately Not Building)

**Building:** A multi-tenant operational backbone connecting CRM → Sales → Orders → Inventory → Finance → Tasks, with RBAC, audit logging, a generic workflow engine, and a thin AI/analytics layer sitting on top of clean data.

**Not building (V1):** A full accounting suite, a full HRMS, a Salesforce/SAP clone, a general-purpose chatbot, or a microservices architecture. Complexity should come from *interconnection*, not from feature count or infrastructure sprawl. A modular monolith is correct for V1.

## 3. Definition of Done for V1

V1 is done when this single scenario works end-to-end, automatically, with an audit trail:

> A salesperson creates an order → inventory is validated and reduced → an invoice is generated → if stock falls below threshold, a procurement task is auto-created and the inventory manager is notified → the dashboard reflects updated revenue and inventory health → every step is attributable in the audit log.

If that loop works cleanly across CRM, Orders, Inventory, Finance, Notifications, and Audit — with RBAC and tenant isolation enforced server-side — you have a legitimate V1, even before Suppliers, Workforce, or AI are fully built out.

## 4. Build Order Rationale

Build **the spine first, breadth second, intelligence last**:

1. You can't demonstrate "interconnected system" with isolated modules — the event propagation is the hard/valuable part, so it needs to exist early, even in a crude form.
2. Every later module (Suppliers, Workforce, Finance depth) hooks into the same event/notification/audit infrastructure — build that infrastructure once, correctly, early.
3. The Workflow Engine and Intelligence Layer are explicitly described in the spec as sitting *on top of* clean operational data — they are the last, not the first, thing to build.

## 5. Phased Build Plan

### Phase 0 — Foundations (infrastructure you don't want to redo later)
**Goal:** A deployable skeleton with identity, tenancy, and CI/CD — nothing business-specific yet.
- Set up repo, Next.js + TypeScript + Tailwind frontend, Node/Next API layer, PostgreSQL.
- Schema: `organizations`, `users`, `roles`, `permissions`.
- Auth (session/JWT via an established library), org-scoped login, RBAC middleware.
- Every table design decision from here on includes `organization_id` — enforce tenant isolation server-side from day one, not retrofitted later.
- Deploy pipeline (Vercel + managed Postgres) working with a "hello world" authenticated page.
- **Exit criteria:** two organizations can sign up, each sees only their own (empty) data, roles restrict a test route.

### Phase 1 — The Core Spine (CRM → Sales → Orders → Inventory)
**Goal:** Prove the end-to-end event propagation loop from Section 18 of the spec.
- Schema: `customers, contacts, leads, deals, products, warehouses, inventory, inventory_movements, sales_orders, order_items`.
- Lead → Qualified → Contacted → Proposal → Negotiation → Won → Customer pipeline (CRM).
- Deal → Sales Order → server-side inventory validation → stock movement record (auditable, not just a quantity decrement).
- **Exit criteria:** confirming an order in the UI correctly reduces stock, creates a movement record referencing the order, and this is visible in both modules.

### Phase 2 — Breadth: Suppliers, Tasks/Projects, Workforce
**Goal:** Extend the graph without duplicating logic.
- `suppliers, purchase_orders` — reuse the same inventory_movement pattern for goods received.
- `projects, tasks, comments` — assignment to employees/teams; keep this lightweight, not an HRMS.
- `employees` records tied to `users`/`organizations`.
- **Exit criteria:** a low-stock product can be manually linked to a new purchase order; a task can be assigned and marked complete.

### Phase 3 — Finance Layer + Notifications + Audit
**Goal:** Close the loop that makes events *matter* to the business, and make every change traceable.
- `invoices, payments, expenses` — operational visibility, not full accounting.
- `notifications` table + delivery mechanism (in-app at minimum).
- `audit_logs` — actor, action, record, before/after, timestamp, reference — applied to inventory, orders, and finance changes first (highest-value audit surface).
- Wire Phase 1's order confirmation to auto-generate an invoice.
- **Exit criteria:** order confirmation → invoice created → audit log entry exists with correct before/after inventory state.

### Phase 4 — Workflow Engine (generalize what you hardcoded)
**Goal:** Replace the hardcoded triggers from Phases 1–3 with a reusable TRIGGER → CONDITION → ACTION engine.
- Schema: `workflows, workflow_rules, workflow_executions`.
- Re-implement "stock below threshold → notify + create task" and "invoice overdue → notify + flag risk" as configurable rules instead of inline code.
- **Exit criteria:** a non-developer-facing config (even a simple admin JSON/UI form) can define a new rule (e.g., "deal inactive 7 days → notify salesperson") without a code change.

### Phase 5 — Dashboard, Reports & Analytics
**Goal:** Make the connected data visible and actionable, not just correct.
- Dashboard: revenue, orders, customers, inventory health, sales trend, critical alerts — each metric click-through to source records (Section 4 of spec).
- `analytics_events` table; basic KPI aggregation queries with pagination/caching where queries get expensive.
- **Exit criteria:** clicking "Inventory: 87% healthy" navigates through low-stock products → a product → its suppliers/POs/movement history, as specified.

### Phase 6 — Intelligence Layer
**Goal:** Add AI/analytics on top of the now-clean operational data — assistive, not autonomous.
- `ai_insights` table. Basic anomaly detection (sales decline vs. baseline), simple demand forecasting, natural-language query over operational data, "explain this KPI change."
- Keep AI advisory: it recommends/explains, it doesn't auto-execute high-impact actions.
- **Exit criteria:** system can answer "which products are likely to go out of stock this month?" from real data, and explain a KPI move in plain language.

### Phase 7 — Hardening & Deployment Readiness
**Goal:** Make it defensible as a real system, not a demo.
- Tenant isolation test suite (org A can never read org B's data, tested explicitly, not assumed).
- RBAC test matrix across roles in Section 2 of the spec.
- Input validation, rate limiting, secure file upload handling, DB constraints review.
- Load-check dashboard/report queries; add indices/caching as justified (don't add Redis speculatively).
- **Exit criteria:** the Section 16 security flow (auth → org membership → permission → resource ownership → transaction) is enforced on every mutating endpoint, verifiably.

## 6. Guardrails Against Scope Creep

Re-check against Section 22 of the spec whenever a phase starts expanding:
- If Workforce starts growing attendance/payroll features → stop, that's HRMS territory, out of V1.
- If Finance starts needing ledgers/tax handling → stop, that's accounting-suite territory.
- If you're adding a microservice "for correctness" rather than a real load problem → stop, monolith is correct at this stage.
- Depth and coherent integration is the goal — not feature count.

## 7. Suggested First Two-Week Sprint

1. Repo, Next.js/TS/Tailwind scaffold, Postgres schema for `organizations/users/roles/permissions`, deploy pipeline live.
2. Auth + org-scoped session + RBAC middleware working on one protected route.
3. `customers/leads/deals` CRUD, scoped by `organization_id`, with server-side authorization checks (no client-side-only guards).
4. `products/inventory` CRUD + one manual stock movement flow.
5. Wire "Deal Won → create Sales Order" as the first real cross-module event — this is your first proof that the architecture's central idea (interconnection) actually works.

If that fifth item works, the hardest architectural risk in the whole project is retired early, and everything after is extension rather than invention.
