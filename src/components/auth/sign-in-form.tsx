"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message ?? "Sign in failed. Please try again.");
      } else {
        router.push("/");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-[0.8125rem] animate-[shake_0.4s_cubic-bezier(0.36,0.07,0.19,0.97)_both]">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signin-email" className="text-[0.8125rem] font-medium text-slate-300 pl-0.5">
            Email address
          </label>
          <div className="relative flex items-center group">
            <Mail className="absolute left-3.5 size-[18px] text-slate-500 pointer-events-none transition-colors group-focus-within:text-violet-400" />
            <input
              id="signin-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full py-3 pl-11 pr-3.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-100 text-sm outline-none placeholder:text-slate-600 transition-all duration-200 hover:border-white/[0.12] focus:bg-white/[0.06] focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.05)]"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signin-password" className="text-[0.8125rem] font-medium text-slate-300 pl-0.5">
            Password
          </label>
          <div className="relative flex items-center group">
            <Lock className="absolute left-3.5 size-[18px] text-slate-500 pointer-events-none transition-colors group-focus-within:text-violet-400" />
            <input
              id="signin-password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              minLength={8}
              className="w-full py-3 pl-11 pr-11 bg-white/[0.04] border border-white/[0.08] rounded-xl text-slate-100 text-sm outline-none placeholder:text-slate-600 transition-all duration-200 hover:border-white/[0.12] focus:bg-white/[0.06] focus:border-violet-500/50 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.1),0_0_20px_rgba(139,92,246,0.05)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 p-1 rounded-md text-slate-500 hover:text-violet-400 hover:bg-white/[0.06] transition-all cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-[18px]" /> : <Eye className="size-[18px]" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl text-white text-[0.9375rem] font-semibold tracking-[0.01em] cursor-pointer transition-all duration-250 relative overflow-hidden hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_8px_25px_rgba(99,102,241,0.35),0_0_40px_rgba(139,92,246,0.15)] active:not-disabled:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="size-[18px] animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>
    </>
  );
}
