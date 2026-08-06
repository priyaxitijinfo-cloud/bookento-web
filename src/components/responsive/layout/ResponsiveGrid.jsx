"use client";

import { cn } from "@/lib/utils";
import { useResponsive } from "@/hooks/responsive";

const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  8: "grid-cols-8",
};

export function ResponsiveGrid({
  children,
  className,
  mobile = 1,
  tablet = 2,
  desktop = 3,
  gap = "gap-4",
}) {
  const { isMobile, isTablet } = useResponsive();
  const cols = isMobile ? mobile : isTablet ? tablet : desktop;

  return (
    <div className={cn("grid", COLS[cols] || COLS[3], gap, className)}>{children}</div>
  );
}
