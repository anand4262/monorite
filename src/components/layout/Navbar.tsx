"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { site } from "@/data/site";
import { mainNav } from "@/data/nav";
import { cn } from "@/lib/utils";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";

/**
 * A floating "dock" nav instead of a full-bleed bar — detached from the
 * edges with its own rounded border, so it reads as an object sitting on
 * top of the page rather than a fixed strip of chrome. The active link is
 * a pill that slides between items via a shared layoutId rather than a
 * static underline, and the mobile menu is a full-screen numbered takeover
 * matching the bracket-label / index-tag language used elsewhere on the
 * site, instead of a plain dropdown list.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-28 bg-gradient-to-b from-canvas via-canvas/70 to-transparent"
      />
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full border px-4 transition-all duration-500 ease-premium md:px-5",
          scrolled || open
            ? "border-canvas-border bg-canvas/80 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border-canvas-border/60 bg-canvas/40 backdrop-blur-md",
        )}
      >
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 font-display text-base font-semibold tracking-tight text-ink"
        >
          <Logo size={30} />
          <span className="hidden sm:inline">{site.name}</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  active ? "text-canvas" : "text-ink-muted hover:text-ink",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 -z-10 rounded-full bg-ink"
                  />
                )}
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button href="/contact" size="sm">
            Start a project
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 -z-10 bg-canvas md:hidden"
          >
            <div className="flex h-full flex-col justify-center px-8 pb-24 pt-28">
              {mainNav.map((item, i) => {
                const active = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.06 }}
                    className="flex items-center gap-4 border-b border-canvas-border py-4"
                  >
                    <span className="font-mono text-xs text-ink-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Link
                      href={item.href}
                      className={cn(
                        "font-display text-3xl font-medium",
                        active ? "text-accent-soft" : "text-ink",
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 + mainNav.length * 0.06 }}
              >
                <Button href="/contact" size="md" className="mt-8">
                  Start a project
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}
