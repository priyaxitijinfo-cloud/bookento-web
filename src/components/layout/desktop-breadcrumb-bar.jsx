"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  BREADCRUMB_BOTTOM_OFFSET_CLASS,
  BREADCRUMB_CURRENT_CLASS,
  BREADCRUMB_INNER_CLASS,
  BREADCRUMB_LINK_CLASS,
  BREADCRUMB_WRAP_CLASS,
  DESKTOP_HEADER_OFFSET_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

export function DesktopBreadcrumbBar({
  backHref,
  backLabel,
  onBack,
  currentLabel,
  trail = [],
  rightAction,
  showHeaderOffset = true,
  showBottomOffset = true,
  className,
}) {
  return (
    <div
      className={cn(
        BREADCRUMB_WRAP_CLASS,
        showHeaderOffset && DESKTOP_HEADER_OFFSET_CLASS,
        showBottomOffset && BREADCRUMB_BOTTOM_OFFSET_CLASS,
        className,
      )}
    >
      <div className={cn(BREADCRUMB_INNER_CLASS, rightAction && "justify-between")}>
        <div className="flex min-w-0 items-center gap-3">
          {onBack ? (
            <button type="button" onClick={onBack} className={BREADCRUMB_LINK_CLASS}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </button>
          ) : (
            <Link href={backHref} className={BREADCRUMB_LINK_CLASS}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Link>
          )}
          {trail.map((item) => (
            <span key={`${item.label}-${item.href ?? "current"}`} className="flex min-w-0 items-center gap-3">
              <span className="text-muted-foreground">/</span>
              {item.href ? (
                <Link href={item.href} className={BREADCRUMB_LINK_CLASS}>
                  {item.label}
                </Link>
              ) : (
                <span className={BREADCRUMB_CURRENT_CLASS}>{item.label}</span>
              )}
            </span>
          ))}
          {currentLabel ? (
            <>
              <span className="text-muted-foreground">/</span>
              <span className={BREADCRUMB_CURRENT_CLASS}>{currentLabel}</span>
            </>
          ) : null}
        </div>
        {rightAction ? <div className="shrink-0">{rightAction}</div> : null}
      </div>
    </div>
  );
}
