import HeroSkeleton from "@/components/ui/skeletons/HeroSkeleton";
import CardGridSkeleton from "@/components/ui/skeletons/CardGridSkeleton";

export default function Loading() {
  return (
    <>
      <HeroSkeleton lines={1} />
      <CardGridSkeleton count={9} columns={3} />
    </>
  );
}
