"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  MOBILE_HEADER_CLASS,
  MOBILE_HEADER_DESKTOP_CLASS,
  MOBILE_HEADER_INNER_CLASS,
  MOBILE_HEADER_ONLY_CLASS,
  MOBILE_HEADER_BACK_TITLE_GROUP_CLASS,
  MOBILE_HEADER_TITLE_CLASS,
} from "@/lib/layout/mobile-header.constants";
import { cn } from "@/lib/utils";

export function ResponsivePageHeader({
  title,
  subtitle,
  backHref,
  showBack = false,
  onBack,
  rightAction,
  className,
  sticky = true,
}) {
  const router = useRouter();
  const showBackButton = Boolean(backHref || showBack || onBack);

  return (
    <header
      className={cn(
        MOBILE_HEADER_CLASS,
        MOBILE_HEADER_DESKTOP_CLASS,
        MOBILE_HEADER_ONLY_CLASS,
        sticky && "sticky top-0",
        className,
      )}
    >
      <div className={cn(MOBILE_HEADER_INNER_CLASS, "justify-between")}>
        <div className={MOBILE_HEADER_BACK_TITLE_GROUP_CLASS}>
          {showBackButton ? (
            onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" strokeWidth={2.25} />
              </button>
            ) : backHref ? (
              <Link
                href={backHref}
                className="text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" strokeWidth={2.25} />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => router.back()}
                className="text-foreground flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-[#F3F4F6]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" strokeWidth={2.25} />
              </button>
            )
          ) : null}
          <div className="min-w-0">
            <h1 className={MOBILE_HEADER_TITLE_CLASS}>{title}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-[#94A3B8]">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {rightAction ? (
          <div className="flex shrink-0 items-center gap-1">{rightAction}</div>
        ) : null}
      </div>
    </header>
  );
}
