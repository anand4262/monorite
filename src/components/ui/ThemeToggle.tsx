"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "vantage-theme";

type Theme = "dark" | "light";

/**
 * Reads the theme that the blocking inline script (see layout.tsx <head>)
 * already applied to <html data-theme="..."> before first paint, so this
 * component never causes a flash — it just syncs its icon state to what's
 * already on screen.
 */
function getAppliedTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(getAppliedTheme());
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mounted ? `Switch to ${theme === "dark" ? "light" : "dark"} mode` : "Toggle theme"}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors duration-300 hover:text-ink"
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ease-premium ${
          mounted && theme === "light" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-300 ease-premium ${
          mounted && theme === "dark" ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
        }`}
      />
    </button>
  );
}
