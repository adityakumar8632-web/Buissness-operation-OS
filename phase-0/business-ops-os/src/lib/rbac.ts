import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import type { Session } from "next-auth";

export class UnauthorizedError extends Error {}
export class ForbiddenError extends Error {}

/**
 * Every protected API route should start by calling this rather than
 * checking `session` directly. Centralizing it means the auth flow from
 * the spec's Section 16 ("verify authentication -> verify permission")
 * is enforced identically everywhere, not reimplemented per route.
 */
export async function requireSession(): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new UnauthorizedError("Not authenticated");
  }
  return session;
}

/**
 * Call after requireSession() when a route needs a specific permission,
 * e.g. requirePermission(session, "inventory:write").
 */
export function requirePermission(session: Session, permissionKey: string): void {
  if (!session.user.permissions.includes(permissionKey)) {
    throw new ForbiddenError(`Missing permission: ${permissionKey}`);
  }
}

/**
 * Tenant isolation guard: confirms a record's organizationId matches the
 * caller's organization before it's returned or mutated. Every future
 * module (orders, inventory, etc.) should run its records through this
 * rather than trusting a client-supplied organization filter.
 */
export function assertSameOrganization(session: Session, recordOrganizationId: string): void {
  if (session.user.organizationId !== recordOrganizationId) {
    throw new ForbiddenError("Resource does not belong to your organization");
  }
}
