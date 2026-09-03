"use client";

import { cn } from "@/lib/utils";
import { DesktopSidebar } from "@/components/responsive/navigation/DesktopSidebar";
import { PageContainer } from "./PageContainer";

export function DesktopLayout({
  children,
  className,
  contentClassName,
  showSidebar = false,
  showHeaderBorder = true,
  header,
  maxWidth = "wide",
  containerClassName,
}) {
  return (
    <div className={cn("bg-surface-page flex min-h-dvh", className)}>
      {showSidebar ? <DesktopSidebar /> : null}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header ? (
          <div
            className={cn(
              "sticky top-0 z-30 shrink-0 bg-white/90 backdrop-blur-md",
              showHeaderBorder && "border-border border-b",
            )}
          >
            {header}
          </div>
        ) : null}
        <main className={cn("min-h-0 flex-1 py-6 lg:py-8", contentClassName)}>
          <PageContainer variant={maxWidth} className={containerClassName}>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
