export { default } from "next-auth/middleware";

// Any route under /dashboard requires a signed-in session.
// This is a first line of defense only — every API route still
// re-checks auth + permissions server-side via lib/rbac.ts, since
// frontend/middleware checks alone are never sufficient (spec Section 16).
export const config = {
  matcher: ["/dashboard/:path*"],
};
