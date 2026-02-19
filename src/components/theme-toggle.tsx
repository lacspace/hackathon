"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative p-2.5 rounded-xl text-muted-foreground hover:bg-foreground/5 transition-all active:scale-95 flex items-center justify-center w-10 h-10"
      title="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        <Sun className="h-5 w-5 absolute inset-0 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="h-5 w-5 absolute inset-0 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </div>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
