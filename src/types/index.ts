import type { LucideIcon } from "lucide-react";

export interface Service {
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  icon: LucideIcon;
  outcomes: string[];
  bullets: string[];
}

export interface Project {
  slug: string;
  client: string;
  industry: string;
  title: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  services: string[];
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readingTime: string;
  category: string;
}

export interface NavItem {
  label: string;
  href: string;
}
