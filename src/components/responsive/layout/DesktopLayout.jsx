"use client";

import { cn } from "@/lib/utils";
import { DesktopSidebar } from "@/components/responsive/navigation/DesktopSidebar";
import { PageContainer } from "./PageContainer";

export function DesktopLayout({
  children,
  className,
  contentClassName,
  showSidebar = true,
  header,
  maxWidth = "wide",
}) {
  return (
    <div className={cn("flex min-h-dvh bg-surface-page", className)}>
      {showSidebar ? <DesktopSidebar /> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {header ? (
          <div className="sticky top-0 z-30 border-b border-border bg-white/90 backdrop-blur-md">
            {header}
          </div>
        ) : null}
        <main className={cn("flex-1 py-6 lg:py-8", contentClassName)}>
          <PageContainer variant={maxWidth}>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
}
