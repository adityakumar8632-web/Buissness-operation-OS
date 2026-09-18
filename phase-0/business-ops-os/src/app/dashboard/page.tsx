import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "./sign-out-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <main className="min-h-screen px-6 py-10 max-w-2xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm tracking-wide text-moss">{session.user.organizationName}</p>
          <h1 className="text-2xl font-semibold text-ink mt-1">Phase 0 checkpoint</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="border border-line rounded-lg p-6 bg-white/60 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">Signed in as</p>
          <p className="text-sm text-ink">
            {session.user.email} — role <span className="font-medium">{session.user.roleName}</span>
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">Organization (tenant)</p>
          <p className="text-sm text-ink">{session.user.organizationName}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">Granted permissions</p>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {session.user.permissions.map((p) => (
              <span key={p} className="text-xs bg-pine/10 text-pine rounded px-2 py-0.5">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-ink/60 mt-6">
        This page and the <code className="text-xs bg-line/50 px-1 rounded">/api/org</code> route are
        the two things Phase 0 exists to prove: a session carries the right organization and role, and
        every request re-checks that server-side rather than trusting the client. Log in as the other
        seeded organization in a separate browser session to confirm you never see this one's data.
      </p>
    </main>
  );
}
