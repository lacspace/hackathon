"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Beaker,
  FileText,
  FlaskConical,
  HelpCircle,
  Trash2,
  Dna,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "./auth-provider";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <Beaker size={20} />, label: "Drug Analysis", path: "/analysis" },
    { icon: <FileText size={20} />, label: "Archive Registry", path: "/files" },
    {
      icon: <FlaskConical size={20} />,
      label: "Validation Suite",
      path: "/test-cases",
    },
    { icon: <HelpCircle size={20} />, label: "Platform FAQs", path: "/faqs" },
  ];

  const handleReset = () => {
    localStorage.removeItem("geneticProfile");
    router.push("/");
  };

  return (
    <aside className="w-72 bg-muted/30 h-screen sticky top-0 hidden lg:flex flex-col animate-in slide-in-from-left duration-700">
      <div className="p-8">
        <div
          className="flex items-center gap-3 mb-10 group cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
            <Dna size={22} />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground">
            PharmaGuard<span className="text-indigo-500">AI</span>
          </span>
        </div>

        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">
            Registry Control
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-foreground text-background shadow-xl shadow-foreground/10 translate-x-1"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  {item.label}
                </div>
                {isActive && (
                  <ChevronRight
                    size={14}
                    className="animate-in fade-in slide-in-from-left-2"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <button
          onClick={handleReset}
          className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-rose-500 hover:bg-rose-500/10 font-black text-xs uppercase tracking-widest transition-all group"
        >
          <Trash2
            size={18}
            className="group-hover:rotate-12 transition-transform"
          />
          Purge Session
        </button>

        <div className="p-5 rounded-3xl bg-indigo-600/5 border border-indigo-600/10">
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
            System Health
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-foreground">
              Encrypted / Live
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
