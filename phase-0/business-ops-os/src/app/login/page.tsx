"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("owner@acme.test");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("That email and password don't match a known account.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-sm tracking-wide text-moss">Business Operations OS</p>
          <h1 className="text-2xl font-semibold text-ink mt-1">Sign in to your workspace</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 border border-line bg-white/60 rounded-lg p-6">
          <div>
            <label htmlFor="email" className="block text-sm text-ink/70 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-ink/70 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pine"
            />
          </div>

          {error && <p className="text-sm text-amber">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-white rounded-md py-2 text-sm font-medium hover:bg-ink transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-xs text-ink/50 mt-4">
          Demo accounts (after seeding): owner@acme.test and owner@northwind.test, password
          "password123" — sign in as each to confirm neither sees the other's data.
        </p>
      </div>
    </main>
  );
}
