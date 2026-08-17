import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

/**
 * For single-item detail pages (a service, a case study, a blog post):
 * a heading block up top, then a couple of body sections underneath.
 */
export default function DetailSkeleton() {
  return (
    <>
      <section className="pb-20 pt-40 md:pb-28 md:pt-48">
        <Container>
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="mt-6 h-12 w-full max-w-2xl md:h-16" />
          <div className="mt-8 space-y-2.5 max-w-xl">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </Container>
      </section>
      <section className="border-t border-canvas-border py-20 md:py-28">
        <Container>
          <Skeleton className="h-8 w-56" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
