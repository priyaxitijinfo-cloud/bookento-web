"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

export function SectionHeader({ title, href, className }) {
  const { t } = useWebLocale();

  return (
    <div
      className={cn("mb-3 flex items-center justify-between gap-4 md:mb-4", className)}
    >
      <h2 className="text-foreground flex items-center gap-0 text-base font-semibold tracking-tight md:gap-2 md:text-xl md:font-bold">
        <span className="section-title-bar mr-1.5 md:mr-2" aria-hidden />
        {title}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-primary hover:text-primary/80 flex shrink-0 items-center gap-0.5 text-xs font-semibold transition-colors md:gap-1 md:text-sm"
        >
          {t("seeAll")}
          <ArrowRight className="size-3.5 md:size-4" />
        </Link>
      )}
    </div>
  );
}

/** Desktop-only marketplace heading: lined label + gradient second line */
export function DesktopSectionHeading({
  badge,
  title,
  highlight,
  badgeKey,
  titleKey,
  highlightKey,
  className,
  align = "center",
}) {
  const { t } = useWebLocale();
  const isLeft = align === "left";
  const badgeText = badgeKey ? t(badgeKey) : badge;
  const titleText = titleKey ? t(titleKey) : title;
  const highlightText = highlightKey ? t(highlightKey) : highlight;

  return (
    <div
      className={cn(
        "mb-6 hidden md:block",
        isLeft ? "text-left" : "text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isLeft ? "justify-start" : "mx-auto justify-center",
        )}
      >
        <span aria-hidden className="h-px w-10 bg-[#C9D3E2]" />
        <span className="text-[12px] font-semibold tracking-[0.22em] text-[#1865EA] uppercase">
          {badgeText}
        </span>
        {!isLeft ? <span aria-hidden className="h-px w-10 bg-[#C9D3E2]" /> : null}
      </div>

      <h2 className="mt-4 text-[calc(2.15rem-6px)] leading-[1.08] font-bold tracking-tight text-[#0F1B2D] lg:text-[calc(2.6rem-6px)]">
        {titleText}
        {highlightText ? (
          <>
            <br />
            <span className="bg-[linear-gradient(105deg,#1865EA_0%,#58A1FF_100%)] bg-clip-text text-transparent">
              {highlightText}
            </span>
          </>
        ) : null}
      </h2>
    </div>
  );
}
