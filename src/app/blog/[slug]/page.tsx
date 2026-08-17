import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { blogPosts, getBlogPostBySlug } from "@/data/blog";
import { buildMetadata } from "@/lib/seo";
import Container from "@/components/ui/Container";
import Badge from "@/components/ui/Badge";
import Reveal from "@/components/ui/Reveal";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) return buildMetadata({ title: "Post not found", noIndex: true });
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article className="pb-24 pt-40 md:pb-32 md:pt-48">
      <Container className="max-w-3xl">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>

        <Reveal onMount delay={0.08}>
          <Badge className="mt-8">{post.category}</Badge>
        </Reveal>
        <Reveal onMount delay={0.14}>
          <h1 className="mt-6 text-balance font-display text-display-md font-semibold text-ink">
            {post.title}
          </h1>
        </Reveal>
        <Reveal onMount delay={0.2}>
          <p className="mt-4 text-sm text-ink-faint">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.readingTime}
          </p>
        </Reveal>

        <div className="mt-12 space-y-6">
          {post.content.map((paragraph, i) => (
            <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
              <p className="text-lg leading-relaxed text-ink-muted">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </article>
  );
}
