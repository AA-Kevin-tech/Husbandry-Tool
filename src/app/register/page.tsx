"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.push("/login?registered=1");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm border rounded-lg p-6 shadow">
        <h1 className="text-xl font-semibold mb-4">Create account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded px-3 py-2 text-black"
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border rounded px-3 py-2 text-black"
              autoComplete="new-password"
            />
            <p className="text-xs text-gray-500 mt-1">
              At least 8 characters, mixed case, number, special character
            </p>
          </div>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-600">
          <Link href="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
          {" · "}
          <Link href="/" className="text-blue-600 hover:underline">
            Home
          </Link>
        </p>
      </div>
    </main>
  );
}
