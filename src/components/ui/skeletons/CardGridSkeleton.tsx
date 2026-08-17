import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

/**
 * A grid of card-shaped placeholders for listing pages (work, blog,
 * services) — each card mirrors a thumbnail + title + one line of copy so
 * the layout doesn't reflow once real cards mount.
 */
export default function CardGridSkeleton({
  count = 6,
  columns = 3,
}: {
  count?: number;
  columns?: 2 | 3;
}) {
  return (
    <section className="pb-24 md:pb-32">
      <Container>
        <div
          className={`grid gap-6 ${columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"}`}
        >
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
