"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

export function Header() {
  const [time, setTime] = useState("");
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const initials = user?.email ? user.email.charAt(0).toUpperCase() : "T";

  return (
    <header className="h-14 border-b border-[#1e1e2a] bg-[#111118]/80 backdrop-blur-sm flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
          <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h1 className="text-sm font-semibold tracking-tight hidden sm:block">
          Trade<span className="text-[#10b981]">Learn</span> AI
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#16161f] rounded-full px-3 py-1.5">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-glow-pulse"></div>
          <span className="text-xs text-[#10b981] font-medium">AI Status: Live & Analyzing</span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs text-[#737373] font-mono">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {time} UTC
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 bg-[#16161f] hover:bg-[#1e1e2a] rounded-lg px-3 py-1.5 transition-colors group cursor-pointer"
          title="Sign out"
        >
          <div className="w-6 h-6 rounded-full bg-[#1e1e2a] group-hover:bg-[#252530] flex items-center justify-center text-[10px] text-[#10b981] font-bold">
            {initials}
          </div>
          <span className="text-xs text-[#e5e5e5] hidden sm:block">
            {user?.email?.split("@")[0] || "Trader"}
          </span>
          <svg className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#ef4444] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
