import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSession, requirePermission, assertSameOrganization, UnauthorizedError, ForbiddenError } from "@/lib/rbac";

// GET /api/org — returns the caller's own organization only.
// This is the smallest possible proof that:
//   1. authentication is enforced (requireSession)
//   2. permission checks are enforced (requirePermission)
//   3. tenant isolation is enforced server-side (assertSameOrganization),
//      not just by trusting the session's organizationId at face value.
export async function GET() {
  try {
    const session = await requireSession();
    requirePermission(session, "org:read");

    const org = await prisma.organization.findUniqueOrThrow({
      where: { id: session.user.organizationId },
    });

    // Redundant with the query above by construction, but this is the
    // pattern every future module route should follow once it's fetching
    // a record by some other id (order id, product id, etc.) rather than
    // trusting session.user.organizationId directly.
    assertSameOrganization(session, org.id);

    return NextResponse.json({
      organization: { id: org.id, name: org.name, slug: org.slug },
      viewer: {
        email: session.user.email,
        role: session.user.roleName,
        permissions: session.user.permissions,
      },
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return NextResponse.json({ error: err.message }, { status: 401 });
    }
    if (err instanceof ForbiddenError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
