import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Mirrors the shape of a typical page hero (badge, 1-3 heading lines,
 * a paragraph, a button) so the page doesn't jump when real content
 * replaces it.
 */
export default function HeroSkeleton({ lines = 2 }: { lines?: number }) {
  return (
    <section className="pb-20 pt-40 md:pb-28 md:pt-48">
      <Container>
        <Skeleton className="h-6 w-44 rounded-full" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-10 md:h-14 ${i === lines - 1 ? "w-2/3" : "w-full max-w-2xl"}`}
            />
          ))}
        </div>
        <div className="mt-8 space-y-2.5 max-w-xl">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <Skeleton className="mt-10 h-12 w-40 rounded-full" />
      </Container>
    </section>
  );
}
