import { cn } from "@/lib/utils";

export function Skeleton({ className, shimmer = true, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl",
        shimmer ? "skeleton-shimmer" : "bg-muted animate-pulse",
        className,
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="border-primary size-10 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
  );
}

/** Desktop home wireframe while mock/API content settles */
export function HomePageSkeleton() {
  return (
    <div className="hidden space-y-[70px] md:block" aria-hidden>
      {/* Categories */}
      <section className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-72" />
        </div>
        <div className="grid grid-cols-5 gap-4 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="size-14 rounded-2xl" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </section>

      {/* Offers */}
      <section className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Professionals */}
      <section className="space-y-5 rounded-none border-y border-[#E8EDF5] bg-[#F7F8FA] py-10">
        <div className="space-y-2 px-0">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-80" />
        </div>
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[280px] shrink-0 space-y-3 rounded-xl border border-[#E8EDF5] bg-white p-3.5"
            >
              <Skeleton className="aspect-[4/3] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-9 w-24 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-72" />
        </div>
        <div className="grid grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[10.5rem] w-full rounded-2xl" />
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="space-y-5">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-0">
              <Skeleton className="aspect-[4/5] w-full rounded-[1.5rem]" />
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section className="space-y-5 border-y border-[#E8EDF5] bg-[#F7F8FA] py-10">
        <div className="grid grid-cols-[0.85fr_1.35fr] gap-10">
          <div className="space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-16 w-full" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="size-9 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="aspect-[2/3] w-48 shrink-0 rounded-[1.35rem]"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
