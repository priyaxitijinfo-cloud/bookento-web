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
        "mb-5 md:mb-6",
        isLeft ? "text-center md:text-left" : "text-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isLeft ? "justify-center md:justify-start" : "mx-auto justify-center",
        )}
      >
        <span aria-hidden className="h-px w-8 bg-[#C9D3E2] md:w-10" />
        <span className="text-[11px] font-semibold tracking-[0.2em] text-[#1865EA] uppercase md:text-[12px] md:tracking-[0.22em]">
          {badgeText}
        </span>
        <span
          aria-hidden
          className={cn("h-px w-8 bg-[#C9D3E2] md:w-10", isLeft && "md:hidden")}
        />
      </div>

      <h2 className="mt-3 text-[1.65rem] leading-[1.1] font-bold tracking-tight text-[#0F1B2D] md:mt-4 md:text-[calc(2.15rem-6px)] lg:text-[calc(2.6rem-6px)]">
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
