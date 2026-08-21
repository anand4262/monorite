import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center py-40">
      <Container className="text-center">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-accent-soft">
          404
        </p>
        <h1 className="mt-4 text-balance font-display text-display-lg font-semibold text-ink">
          This page took a wrong turn.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-ink-muted">
          The page you're looking for doesn't exist or has moved.
        </p>
        <div className="mt-10 flex justify-center">
          <Button href="/">Back to home</Button>
        </div>
      </Container>
    </section>
  );
}
