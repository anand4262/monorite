/** @type {import('next').NextConfig} */

// Content-Security-Policy: kept as strict as the stack allows while still
// supporting static generation (SSG) for every marketing page.
//
// 'unsafe-inline' is present on script-src as a deliberate, documented
// trade-off: Next.js App Router injects small inline <script> tags at
// render time to stream RSC/hydration data, and blocking those requires a
// per-request nonce generated in middleware — which in turn forces every
// page into dynamic rendering (no SSG, no CDN caching of HTML). For a
// content-driven site with no dangerouslySetInnerHTML and no user-generated
// HTML anywhere in the codebase, the realistic residual XSS risk from this
// is low, and static rendering is kept. If you later add features that
// render untrusted HTML (rich comments, a CMS with raw HTML fields, etc.),
// switch to the nonce + middleware pattern from the Next.js CSP docs:
// https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
// Next.js's dev-mode React Refresh (hot reload) runtime evaluates code via
// eval() to apply updates without a full page reload. A CSP without
// 'unsafe-eval' blocks that eval() call outright — which throws inside the
// very first chunk of client JS, so the whole bundle fails to execute and
// React never hydrates. Every Framer Motion element then stays frozen at
// its initial (invisible) state, which is what "the page renders blank"
// actually was. This only matters in development: production builds don't
// use eval-based HMR, so 'unsafe-eval' is left out of the deployed CSP.
const isDev = process.env.NODE_ENV === "development";

// Google Analytics (gtag.js, loaded via @next/third-parties in layout.tsx)
// needs two separate allowances: the script itself loads from
// googletagmanager.com, and every tracked event is then a separate
// network call out to google-analytics.com — without both, the browser
// silently blocks it and analytics never fires, with no visible error
// beyond a CSP violation in the console.
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob: https://play-lh.googleusercontent.com https://vistalegalfirm.com https://www.vistalegalfirm.com https://kebab-knights.vercel.app https://images.unsplash.com;
  font-src 'self' data:;
  connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com;
  frame-src https://www.google.com https://maps.google.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    // microphone=(self): the chat widget's voice input needs mic access
    // for the page's own origin. Was microphone=() (blocked entirely) from
    // before that feature existed — that setting silently denied every
    // getUserMedia call the Web Speech API made, with no error surfaced
    // to the page, before the browser even reached a permission prompt.
    // "self" keeps third-party iframes embedded on the page from getting
    // mic access (there are none today, but the site has no reason to
    // allow it), while still letting the page itself use it.
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // pdf-parse (used by the chat service's PDF-upload intake) pulls in
  // pdfjs-dist, which has browser-oriented module code that breaks when
  // webpack bundles it into the RSC/route-handler build ("Object.
  // defineProperty called on non-object" at import time — crashes every
  // request to the route, not just ones with a PDF attached). Marking it
  // external makes Next use Node's native require for this package
  // instead of bundling it, which is the documented fix for this class
  // of PDF/canvas-library incompatibility in the App Router.
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  // The site consolidated to a single-page homepage (hero, services, work,
  // and studio all live at / behind anchor links) — these index routes
  // redirect to their new anchor section. Individual detail pages
  // (/services/[slug], /work/[slug]) are unaffected: this only matches the
  // exact index path, not its sub-paths.
  async redirects() {
    return [
      { source: "/about", destination: "/#studio", permanent: true },
      { source: "/services", destination: "/#services", permanent: true },
      { source: "/work", destination: "/#work", permanent: true },
    ];
  },
};

export default nextConfig;
