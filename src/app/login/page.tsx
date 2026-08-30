"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!loading && user) {
    router.push("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signIn(email, password);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold">
              Trade<span className="text-[#10b981]">Learn</span> AI
            </h1>
          </div>
          <p className="text-[#737373] text-sm">
            Sign in to access the Live AI Trade Room
          </p>
        </div>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg px-3 py-2 text-sm text-[#ef4444]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-[#737373] mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              required
              className="w-full bg-[#111118] border border-[#1e1e2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#10b981] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-[#737373] mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              minLength={6}
              className="w-full bg-[#111118] border border-[#1e1e2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#10b981] transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || loading}
            className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
          >
            {isLoading ? "Signing in..." : "Enter Trade Room"}
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link
            href="/signup"
            className="text-sm text-[#737373] hover:text-[#10b981] transition-colors"
          >
            Don&apos;t have an account?{" "}
            <span className="text-[#10b981]">Sign up</span>
          </Link>
        </div>

        <p className="text-center text-[10px] text-[#3a3a4a]">
          Simulated paper trading for educational purposes only.
        </p>
      </div>
    </div>
  );
}
