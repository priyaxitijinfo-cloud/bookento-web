"use client";

import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }) {
  return (
    <div
      className={cn("animate-pulse rounded-xl bg-muted", className)}
      aria-hidden
    />
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn("space-y-3 rounded-xl border border-border bg-background p-4", className)}>
      <SkeletonBlock className="h-36 w-full" />
      <SkeletonBlock className="h-4 w-2/3" />
      <SkeletonBlock className="h-3 w-1/2" />
    </div>
  );
}
