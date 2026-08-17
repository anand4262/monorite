import Container from "@/components/ui/Container";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Two-column shape matching the contact page: heading + contact details
 * on the left, a form-shaped block of stacked fields on the right.
 */
export default function FormSkeleton() {
  return (
    <section className="pb-24 pt-40 md:pb-32 md:pt-48">
      <Container className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="mt-6 h-12 w-full max-w-md" />
          <div className="mt-6 space-y-2.5 max-w-sm">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="mt-10 space-y-4">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-56" />
          </div>
        </div>
        <div className="space-y-5 rounded-2xl border border-canvas-border p-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </Container>
    </section>
  );
}
