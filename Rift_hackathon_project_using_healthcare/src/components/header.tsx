"use client";

import React, { useState, useEffect, useRef } from "react";
import { ThemeToggle } from "./theme-toggle";
import {
  UserCircle,
  Bell,
  CheckCircle2,
  Info,
  AlertTriangle,
  LogOut,
  ChevronDown,
  LayoutGrid,
  Search,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/constants";

export function TopHeader({ title }: { title: string }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/notifications`);
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (e) {}
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markRead = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: "PUT",
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (e) {}
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="flex items-center justify-between p-4 lg:px-10 lg:py-6 sticky top-0 z-40 mb-8 w-full bg-background/50 backdrop-blur-xl border-b border-foreground/5 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="flex-1 flex items-center gap-8">
        <div className="hidden lg:flex flex-col">
          <h1 className="text-3xl font-black text-foreground tracking-tighter leading-none italic uppercase">
            {title}
          </h1>
          <div className="flex items-center gap-2 mt-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none">
              Secured Node
            </span>
          </div>
        </div>

        <div className="relative group max-w-sm w-full hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground/40 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <input
            type="text"
            placeholder="Search clinical registry..."
            className="w-full bg-muted/20 border border-foreground/5 py-2.5 pl-11 pr-4 rounded-2xl text-sm font-bold placeholder:text-muted-foreground/40 outline-none focus:bg-muted/40 transition-all focus:border-indigo-500/30 text-foreground"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-muted/10 rounded-[1.25rem] border border-foreground/5 shadow-inner">
          <ThemeToggle />

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all relative ${showNotifications ? "bg-foreground text-background" : "hover:bg-foreground/5 text-muted-foreground"}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-background"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-[-60px] md:right-0 mt-5 w-80 sm:w-[400px] box-premium rounded-[2.5rem] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4">
                <div className="p-6 border-b border-foreground/5 flex justify-between items-center bg-muted/10">
                  <div>
                    <h3 className="text-lg font-black text-foreground tracking-tight leading-none mb-1">
                      Alert Stream
                    </h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Clinical Event Log
                    </p>
                  </div>
                  <button className="p-2 hover:bg-foreground/5 rounded-lg transition-colors">
                    <Settings size={14} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-30 italic">
                      No active alerts found
                    </div>
                  ) : (
                    notifications.map((notif: any) => (
                      <div
                        key={notif.id}
                        onClick={() => markRead(notif.id)}
                        className={`p-6 border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors cursor-pointer flex gap-4 ${!notif.read ? "bg-indigo-500/[0.02]" : "opacity-50"}`}
                      >
                        <div
                          className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === "success" ? "bg-emerald-500/10 text-emerald-500" : notif.type === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-indigo-500/10 text-indigo-500"}`}
                        >
                          {notif.type === "success" ? (
                            <CheckCircle2 size={16} />
                          ) : notif.type === "warning" ? (
                            <AlertTriangle size={16} />
                          ) : (
                            <Info size={16} />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-black text-foreground mb-0.5 tracking-tight">
                            {notif.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed font-medium line-clamp-2">
                            {notif.message}
                          </p>
                          <span className="text-[9px] font-black text-muted-foreground/40 mt-2 block uppercase tracking-widest">
                            {new Date(notif.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div ref={profileRef} className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-3 p-1 rounded-[1.25rem] transition-all border border-foreground/5 ${showProfile ? "bg-foreground shadow-2xl" : "bg-muted/10 hover:bg-muted/20"}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform ${showProfile ? "bg-background text-foreground scale-90" : "bg-indigo-600 text-white"}`}
            >
              <UserCircle size={22} />
            </div>
            <div className="hidden sm:flex flex-col text-left pr-2">
              <span
                className={`text-xs font-black leading-none ${showProfile ? "text-background" : "text-foreground"}`}
              >
                {user?.name || "Clinician"}
              </span>
              <span
                className={`text-[9px] font-black uppercase tracking-widest mt-1 ${showProfile ? "text-background/60" : "text-muted-foreground"}`}
              >
                {user?.role || "Researcher"}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 mr-2 transition-transform ${showProfile ? "rotate-180 text-background" : "text-muted-foreground"}`}
            />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-5 w-72 box-premium rounded-[2.5rem] overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 shadow-2xl">
              <div className="p-8 bg-muted/5 border-b border-foreground/5 relative overflow-hidden">
                <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <LayoutGrid size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-foreground tracking-tighter leading-none mb-1">
                      {user?.name}
                    </h3>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest italic">
                      {user?.role || "Medical Admin"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 text-sm font-bold text-foreground transition-all group">
                  <div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground">
                    <Settings size={18} />
                    Protocol Settings
                  </div>
                  <ChevronRight size={14} className="opacity-30" />
                </button>
                <div className="h-px bg-foreground/5 my-2 mx-4"></div>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-rose-500/5 text-rose-500 text-sm font-black uppercase tracking-widest transition-all group"
                >
                  <LogOut
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                  Terminate Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
