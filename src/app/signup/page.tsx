"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, verifyEmail, user, loading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);

  if (!loading && user) {
    router.push("/dashboard");
    return null;
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await signUp(email, password, name || undefined);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.requireEmailVerification) {
      setNeedsVerification(true);
    } else {
      router.push("/dashboard");
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const result = await verifyEmail(email, otp);
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
            {needsVerification
              ? "Enter the 6-digit code sent to your email"
              : "Create an account to start trading"}
          </p>
        </div>

        {error && (
          <div className="bg-[#ef4444]/10 border border-[#ef4444]/30 rounded-lg px-3 py-2 text-sm text-[#ef4444]">
            {error}
          </div>
        )}

        {needsVerification ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="text-xs text-[#737373] mb-1 block">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                maxLength={6}
                pattern="[0-9]{6}"
                className="w-full bg-[#111118] border border-[#1e1e2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#10b981] transition-colors text-center tracking-[0.5em] font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
              {isLoading ? "Verifying..." : "Verify & Enter"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="text-xs text-[#737373] mb-1 block">
                Name (optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Trader"
                className="w-full bg-[#111118] border border-[#1e1e2a] rounded-lg px-3 py-2.5 text-sm text-[#e5e5e5] placeholder:text-[#3a3a4a] focus:outline-none focus:border-[#10b981] transition-colors"
              />
            </div>
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
                placeholder="Min 6 characters"
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
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        )}

        <div className="text-center space-y-2">
          <Link
            href="/login"
            className="text-sm text-[#737373] hover:text-[#10b981] transition-colors"
          >
            Already have an account?{" "}
            <span className="text-[#10b981]">Sign in</span>
          </Link>
        </div>

        <p className="text-center text-[10px] text-[#3a3a4a]">
          Simulated paper trading for educational purposes only.
        </p>
      </div>
    </div>
  );
}
