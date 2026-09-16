"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-sm text-ink/60 hover:text-ink border border-line rounded-md px-3 py-1.5"
    >
      Sign out
    </button>
  );
}
