import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { site } from "@/data/site";
import { blogPosts } from "@/data/blog";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

export const metadata = buildMetadata({
  title: "Blog",
  description: `Notes on AI, automation, and running a service business, from the ${site.name} team.`,
  path: "/blog",
});

export default function BlogPage() {
  return (
    <section className="pb-24 pt-40 md:pb-32 md:pt-48">
      <Container>
        <Badge>Blog</Badge>
        <Reveal onMount delay={0.08}>
          <h1 className="mt-6 max-w-2xl text-balance font-display text-display-lg font-semibold text-ink">
            Notes on AI, automation, and running the business behind the business
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.06}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-canvas-border bg-canvas-surface/40 p-7 transition-all duration-500 ease-premium hover:border-accent/40 hover:bg-canvas-surface"
              >
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-soft">
                    {post.category}
                  </span>
                  <h2 className="mt-4 font-display text-xl font-semibold text-ink">
                    {post.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{post.excerpt}</p>
                </div>
                <div className="mt-8 flex items-center justify-between border-t border-canvas-border pt-5 text-xs text-ink-faint">
                  <span>{post.readingTime}</span>
                  <ArrowRight className="h-4 w-4 text-ink-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-ink" />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
