"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem("theme", theme);
}

export default function ThemeToggle({ className }: { className?: string }) {
  // Starts null (not "dark") so the button renders nothing on the server
  // and the very first client render, matching whatever the no-flash
  // inline script in layout.tsx already set on <html> before hydration —
  // guessing "dark" here would flash-swap the icon the instant React
  // reads the real value from localStorage.
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme((document.documentElement.dataset.theme as Theme) ?? "dark");
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink",
        className,
      )}
    >
      {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
    </button>
  );
}
