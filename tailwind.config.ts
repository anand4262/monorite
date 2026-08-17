import type { Config } from "tailwindcss";

/**
 * Builds a Tailwind color function that reads an RGB-triplet CSS custom
 * property (e.g. "124 92 255") so the whole palette can be swapped at
 * runtime via the `data-theme` attribute (see globals.css) without any
 * component needing a `dark:`-style variant. Supports Tailwind's opacity
 * modifiers (`bg-accent/40`) transparently.
 */
function withOpacity(variable: string, fallbackAlpha?: number) {
  return ({ opacityValue }: { opacityValue?: string }) => {
    const alpha = opacityValue ?? fallbackAlpha ?? 1;
    // CSS Color 4 slash syntax — required because the custom properties
    // hold space-separated RGB triplets ("8 9 10"), not comma-separated
    // ones. rgba(var(--x), 1) would expand to the invalid "rgba(8 9 10, 1)"
    // and silently fail (every element falls back to a transparent/default
    // color with no console warning) — that was the cause of the site
    // rendering with no backgrounds, borders, or accent colors.
    return `rgb(var(${variable}) / ${alpha})`;
  };
}

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
    },
    extend: {
      colors: {
        canvas: {
          DEFAULT: withOpacity("--color-canvas"),
          soft: withOpacity("--color-canvas-soft"),
          surface: withOpacity("--color-canvas-surface"),
          // Static reference, not a function: Tailwind calls
          // function-based colors with opacityValue "1" whenever no /NN
          // modifier is present, which made the 0.08 fallback alpha
          // unreachable in practice (border-canvas-border was rendering
          // fully opaque). --border-hairline in globals.css already has
          // the alpha baked in per theme.
          border: "var(--border-hairline)",
        },
        ink: {
          DEFAULT: withOpacity("--color-ink"),
          muted: withOpacity("--color-ink-muted"),
          faint: withOpacity("--color-ink-faint"),
        },
        accent: {
          DEFAULT: withOpacity("--color-accent"),
          soft: withOpacity("--color-accent-soft"),
          dim: withOpacity("--color-accent-dim"),
        },
        mint: {
          DEFAULT: withOpacity("--color-mint"),
          soft: withOpacity("--color-mint-soft"),
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(4rem, 11vw, 11.5rem)", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-xl": ["clamp(3rem, 6vw, 7rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 4.5vw, 4.75rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2rem, 3vw, 3rem)", { lineHeight: "1.08", letterSpacing: "-0.02em" }],
      },
      maxWidth: {
        content: "1440px",
      },
      backgroundImage: {
        "grain": "url('/images/grain.png')",
        "radial-fade": "radial-gradient(circle at 50% 0%, rgba(124,92,255,0.16), transparent 60%)",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        marquee: "marquee 28s linear infinite",
        "marquee-slow": "marquee 44s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
