"use client";

import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { DesktopSidebar } from "@/components/responsive/navigation/DesktopSidebar";
import { cn } from "@/lib/utils";
import { PageContainer } from "./PageContainer";

export function DesktopLayout({
  children,
  className,
  contentClassName,
  showSidebar = false,
  showHeaderBorder = true,
  showHomeHeader = true,
  showWebFooter = true,
  header,
  maxWidth = "wide",
  containerClassName,
}) {
  const hasChrome = showHomeHeader || Boolean(header);

  return (
    <div
      className={cn("bg-surface-page flex h-dvh flex-col overflow-hidden", className)}
    >
      <div className="flex min-h-0 min-w-0 flex-1">
        {showSidebar ? <DesktopSidebar /> : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          {hasChrome ? (
            <div
              className={cn(
                "z-30 shrink-0 bg-white/90 backdrop-blur-md",
                showHeaderBorder && "border-border border-b",
              )}
            >
              {showHomeHeader ? <HomeHeader embedded /> : null}
              {header}
            </div>
          ) : null}
          <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
            <main className={cn("min-h-0 flex-1 py-6 lg:py-8", contentClassName)}>
              <PageContainer variant={maxWidth} className={containerClassName}>
                {children}
              </PageContainer>
            </main>
            {showWebFooter ? <HomeFooter className="mt-0 md:mt-10" /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}
