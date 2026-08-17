import HeroSkeleton from "@/components/ui/skeletons/HeroSkeleton";
import CardGridSkeleton from "@/components/ui/skeletons/CardGridSkeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton lines={2} />
      <CardGridSkeleton count={6} columns={3} />
    </>
  );
}
