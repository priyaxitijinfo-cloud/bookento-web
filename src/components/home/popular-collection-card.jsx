"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useWebLocale } from "@/hooks/use-web-locale";
import { cn } from "@/lib/utils";

/**
 * Web-only collection card — image + title + body + Explore link.
 */
export function PopularCollectionCard({ collection, className }) {
  const { t } = useWebLocale();

  return (
    <article className={cn("group flex flex-col", className)}>
      <Link
        href={collection.href}
        className="flex h-full flex-col focus-visible:rounded-2xl focus-visible:ring-2 focus-visible:ring-[#1865EA]/40 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-[1.15rem] bg-[#EEF2F7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collection.image}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover",
              collection.imageFocus,
            )}
            loading="lazy"
            decoding="async"
          />
        </div>

        <h3 className="mt-4 text-[1.15rem] leading-snug font-bold tracking-tight text-[#0F1B2D] lg:text-[1.25rem]">
          {t(collection.titleKey)}
        </h3>
        <p className="mt-1.5 text-[14px] leading-snug text-[#6B7A8D]">
          {t(collection.bodyKey)}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-[14px] font-semibold text-[#1865EA]">
          {t("popularCollectionExplore")}
          <ArrowRight className="size-4" strokeWidth={2.4} aria-hidden />
        </span>
      </Link>
    </article>
  );
}
