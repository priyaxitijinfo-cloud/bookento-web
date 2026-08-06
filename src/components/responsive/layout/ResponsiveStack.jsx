"use client";

import { cn } from "@/lib/utils";

export function ResponsiveStack({
  children,
  className,
  direction = "vertical",
  gap = "gap-4",
  align,
}) {
  return (
    <div
      className={cn(
        "flex",
        direction === "horizontal" ? "flex-row" : "flex-col",
        gap,
        align,
        className
      )}
    >
      {children}
    </div>
  );
}
