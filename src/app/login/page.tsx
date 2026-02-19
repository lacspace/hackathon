"use client";

import React, { useState } from "react";
import { useAuth } from "../../components/auth-provider";
import { API_BASE_URL } from "../../lib/constants";
import { Dna, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        login(data.token, data.user);
      } else {
        setError(
          data.error ||
            "Invalid credentials. Use admin@lacspace.com / Abcd@123.45",
        );
      }
    } catch (err) {
      setError("Failed to connect to authentication server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none mb-4 text-white">
            <Dna size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-foreground dark:text-foreground tracking-tight">
            PharmaGuard Access
          </h1>
          <p className="text-muted-foreground dark:text-muted-foreground mt-2 font-medium">
            Master Authentication Protocol
          </p>
        </div>

        <div className="box-premium rounded-[2.5rem] p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-3">
                <AlertCircle size={20} className="flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground ml-1">
                Workspace Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/20 border border-foreground/5 focus:border-indigo-500 outline-none transition-all text-foreground font-medium"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground dark:text-muted-foreground ml-1">
                Security Key
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-muted/20 border border-foreground/5 focus:border-indigo-500 outline-none transition-all text-foreground font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : (
                "Finalize Access"
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-muted-foreground dark:text-muted-foreground text-sm font-medium">
          Authorized clinical personnel only.
        </p>
      </div>
    </div>
  );
}
