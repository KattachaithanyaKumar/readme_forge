export const SkeletonLine = ({ w = "100%" }: { w?: string }) => (
  <div
    className="h-3 rounded bg-(--white-10) animate-pulse"
    style={{ width: w }}
  />
);

export const SkeletonMd = () => (
  <div className="space-y-3">
    <div className="h-8 w-2/3 rounded bg-(--white-10) animate-pulse" />
    <SkeletonLine w="90%" />
    <SkeletonLine w="95%" />
    <SkeletonLine w="80%" />
    <div className="h-5 w-1/3 rounded bg-(--white-10) animate-pulse mt-6" />
    <SkeletonLine w="92%" />
    <SkeletonLine w="85%" />
    <SkeletonLine w="70%" />
    <div className="h-5 w-1/2 rounded bg-(--white-10) animate-pulse mt-6" />
    <SkeletonLine w="96%" />
    <SkeletonLine w="88%" />
    <SkeletonLine w="60%" />
    <div className="h-32 w-full rounded bg-(--white-10) animate-pulse mt-6" />
  </div>
);
