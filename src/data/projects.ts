import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "vista-legal-website",
    client: "Vista Legal",
    industry: "Legal",
    title: "A complete, search-ready website for a Bengaluru law firm",
    summary:
      "A full website build for a Bengaluru advocacy practice, covering seven practice areas, built, optimised for search, and deployed live.",
    challenge:
      "Vista Legal had no real online presence beyond word of mouth and directory listings, so prospective clients across Bengaluru had no way to find or vet the firm before calling.",
    solution:
      "We designed and built their site from the ground up, including practice area pages, attorney profiles, and a contact flow, and structured it for local SEO so the firm shows up for the searches Bengaluru clients actually use.",
    journey: [
      {
        step: "01",
        title: "Discovery",
        description:
          "We mapped out Vista Legal's seven practice areas with the founders and worked out how prospective clients actually search for a law firm in Bengaluru.",
      },
      {
        step: "02",
        title: "Design & build",
        description:
          "We designed clean, trust-building pages for each practice area and attorney, then built the site fast and mobile-first on React and Node.js.",
      },
      {
        step: "03",
        title: "SEO & launch",
        description:
          "Every page was structured around local search (Bengaluru-specific keywords, clean metadata, a sitemap), then deployed live.",
      },
      {
        step: "04",
        title: "Result",
        description:
          "Vista Legal now has a real front door online: a site that ranks, loads fast, and gives prospective clients a reason to call before their competitors do.",
      },
    ],
    results: [
      { label: "Practice areas covered", value: "7" },
      { label: "Build time", value: "~2 weeks" },
      { label: "Status", value: "Live" },
    ],
    services: ["website-online-presence"],
    visitUrl: "https://vistalegalfirm.com",
    stack: ["React", "Node.js", "SEO"],
    orientation: "landscape",
    icon: "https://vistalegalfirm.com/images/Vista-Legal-Registered-Logo.png",
    image: "/images/work/vista-legal/home.png",
    screenshots: [
      "/images/work/vista-legal/home.png",
      "/images/work/vista-legal/practice-areas.png",
      "/images/work/vista-legal/about-section.png",
    ],
  },
  {
    slug: "kebab-knights-website",
    client: "Kebab Knights",
    industry: "Food & Hospitality",
    title: "A late-night, mobile-first website for Melbourne's favourite kebab spot",
    summary:
      "A bold marketing site for a Melbourne halal kebab shop, with a full menu, photo gallery, testimonials, and location, built to match their street-food energy.",
    challenge:
      "Kebab Knights needed a site that matched their late-night, high-energy brand and let hungry customers browse the menu, see the food, and find them fast, especially after midnight.",
    solution:
      "We built a fast, mobile-first site with a full categorised menu, a photo gallery of the food, customer testimonials, an embedded map, and one-tap contact, so anyone craving a midnight kebab finds what they need in seconds.",
    journey: [
      {
        step: "01",
        title: "Discovery",
        description:
          "We got to know the brand (late-night, high-energy, street-food) and worked out what customers actually need before ordering: the menu, the vibe, the hours.",
      },
      {
        step: "02",
        title: "Design & build",
        description:
          "We built a fast, mobile-first site on Next.js: a full categorised menu, a photo gallery of the food, and an embedded map so hungry customers can find them fast.",
      },
      {
        step: "03",
        title: "Launch",
        description: "Deployed live and tuned for the after-midnight crowd searching on their phones.",
      },
      {
        step: "04",
        title: "Result",
        description:
          "A site that matches the energy of the brand and makes it easy to go from craving to order.",
      },
    ],
    results: [
      { label: "Menu categories", value: "7" },
      { label: "Delivered", value: "Website + gallery" },
      { label: "Status", value: "Live" },
    ],
    services: ["website-online-presence"],
    visitUrl: "https://kebab-knights.vercel.app/",
    stack: ["Next.js", "SEO"],
    orientation: "landscape",
    icon: "https://kebab-knights.vercel.app/_next/image?url=%2Fimages%2Flogo%2Fkebab-knights-logo-t.png&w=384&q=75",
    image: "/images/work/kebab-knights/home.png",
    screenshots: [
      "/images/work/kebab-knights/home.png",
      "/images/work/kebab-knights/menu-section.png",
      "/images/work/kebab-knights/gallery-section.png",
    ],
  },
  {
    slug: "cable-pulse-crm",
    client: "Cable Pulse CRM",
    industry: "Cable & Internet Operators",
    title: "Subscriber management and billing built for how operators actually work",
    summary:
      "An Android app for cable and internet operators to manage customers, collect payments, and track dues, replacing the notebook.",
    challenge:
      "Local cable operators were tracking subscribers and billing by hand, using paper ledgers and spreadsheets that made it easy to miss payments and hard to see who owed what, village by village.",
    solution:
      "We built a dedicated Android app: customers organised by village and area, full or partial payments recorded in seconds (cash or UPI), dues calculated automatically from each plan, and a daily dashboard of collections, expenses, and net cash in hand. Works offline and syncs when back online.",
    journey: [
      {
        step: "01",
        title: "Discovery",
        description:
          "We spent time understanding how cable operators actually track subscribers day to day, village by village, mostly on paper.",
      },
      {
        step: "02",
        title: "Design & build",
        description:
          "We designed a simple Android app around that existing workflow: organise by village, record payments in seconds, calculate dues automatically.",
      },
      {
        step: "03",
        title: "Offline-first engineering",
        description:
          "Field connectivity isn't always reliable, so the app was built to work fully offline and sync automatically once back online.",
      },
      {
        step: "04",
        title: "Result",
        description:
          "Operators across Andhra Pradesh and Telangana now run their books from their phone instead of a notebook.",
      },
    ],
    results: [
      { label: "Platform", value: "Android" },
      { label: "Core functions", value: "Billing + subscribers" },
      { label: "Status", value: "Live on Google Play" },
    ],
    services: ["custom-business-software"],
    visitUrl: "https://play.google.com/store/apps/details?id=com.cable.pulse.crm&hl=en_IN",
    stack: ["React Native", "Java", "Android"],
    orientation: "portrait",
    icon: "/images/work/cable-pulse-crm/icon.png",
    image: "/images/work/cable-pulse-crm/screenshot-1.png",
    screenshots: [
      "/images/work/cable-pulse-crm/screenshot-1.png",
      "/images/work/cable-pulse-crm/screenshot-2.png",
      "/images/work/cable-pulse-crm/screenshot-3.png",
      "/images/work/cable-pulse-crm/screenshot-4.png",
      "/images/work/cable-pulse-crm/screenshot-5.png",
      "/images/work/cable-pulse-crm/screenshot-6.png",
    ],
  },
  {
    slug: "rummy-score-tracker",
    client: "Rummy Score Tracker",
    industry: "Consumer Apps",
    title: "A fast, offline scorekeeper for card game nights",
    summary:
      "An Android app that tracks Rummy and Poker scores instantly. No login, no setup, works completely offline.",
    challenge:
      "Keeping score for Rummy and Poker by hand gets messy fast: miscounted rounds, lost paper, arguments over who's actually winning.",
    solution:
      "We built and shipped a simple score tracker: add players in seconds, track multiple rounds without confusion, automatic score calculation, and full game history, with a clean interface in light or dark theme.",
    journey: [
      {
        step: "01",
        title: "Idea",
        description:
          "A simple, recurring problem: messy pen-and-paper scorekeeping during card game nights, with no good lightweight app to solve it.",
      },
      {
        step: "02",
        title: "Build",
        description:
          "We built a fast, offline-first Android app: add players, track rounds, calculate scores automatically, no login or setup required.",
      },
      {
        step: "03",
        title: "Ship",
        description:
          "Published to Google Play as a focused, single-purpose utility, not weighed down with features nobody asked for.",
      },
      {
        step: "04",
        title: "Result",
        description: "A tool people actually use for exactly what it's for, whenever the cards come out.",
      },
    ],
    results: [
      { label: "Platform", value: "Android" },
      { label: "Setup required", value: "None" },
      { label: "Status", value: "Live on Google Play" },
    ],
    services: ["custom-business-software"],
    visitUrl: "https://play.google.com/store/apps/details?id=com.rahulsai.cardsscoreboard&hl=en_IN",
    stack: ["React Native", "Android"],
    orientation: "portrait",
    icon: "/images/work/rummy-score-tracker/icon.png",
    image: "/images/work/rummy-score-tracker/screenshot-1.png",
    screenshots: [
      "/images/work/rummy-score-tracker/screenshot-1.png",
      "/images/work/rummy-score-tracker/screenshot-2.png",
      "/images/work/rummy-score-tracker/screenshot-3.png",
      "/images/work/rummy-score-tracker/screenshot-4.png",
      "/images/work/rummy-score-tracker/screenshot-5.png",
      "/images/work/rummy-score-tracker/screenshot-6.png",
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
