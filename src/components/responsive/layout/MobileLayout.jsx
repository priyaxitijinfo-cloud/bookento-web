"use client";

import { cn } from "@/lib/utils";
import { UserBottomNav } from "@/components/layout/user-nav";

export function MobileLayout({
  children,
  className,
  showBottomNav = true,
  maxWidth = true,
}) {
  return (
    <div
      className={cn(
        "min-h-dvh bg-[#F7F8FC]",
        showBottomNav && "pb-[5.5rem]",
        className
      )}
    >
      <div className={cn(maxWidth && "mx-auto w-full max-w-lg")}>{children}</div>
      {showBottomNav ? <UserBottomNav /> : null}
    </div>
  );
}
