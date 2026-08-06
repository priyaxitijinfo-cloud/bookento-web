"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
        "z-30 border-b border-[#ECECF2] bg-white/95 backdrop-blur-md",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          {showBackButton ? (
            onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#1A1A2E] transition-colors hover:bg-[#F7F8FC]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
            ) : backHref ? (
              <Link
                href={backHref}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#1A1A2E] transition-colors hover:bg-[#F7F8FC]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => router.back()}
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-[#1A1A2E] transition-colors hover:bg-[#F7F8FC]"
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
            )
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-[#1A1A2E]">{title}</h1>
            {subtitle ? (
              <p className="truncate text-xs text-[#6B7280]">{subtitle}</p>
            ) : null}
          </div>
        </div>
        {rightAction ? <div className="flex shrink-0 items-center gap-1">{rightAction}</div> : null}
      </div>
    </header>
  );
}
