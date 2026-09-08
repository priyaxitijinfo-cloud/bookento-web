import Link from "next/link";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

export function CategoryIcon({
  category,
  compact = false,
  fullPage = false,
  tone = "brand",
  className,
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 bg-current",
        tone === "white" ? "text-white" : category.iconColor,
        fullPage ? "size-[42px]" : compact ? "size-9" : "size-10 sm:size-11",
        className,
      )}
      style={{
        WebkitMaskImage: `url(${category.iconImage})`,
        maskImage: `url(${category.iconImage})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function CategoryItem({
  category,
  compact = false,
  fullPage = false,
  className,
}) {
  return (
    <Link
      href={categoryListingRoute(category.slug)}
      className={cn(
        category.bg,
        "group flex min-w-0 flex-col items-center justify-center rounded-2xl border-white shadow-[0_8px_20px_-4px_rgba(15,23,42,0.12),0_4px_8px_-4px_rgba(15,23,42,0.06)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_28px_-4px_rgba(15,23,42,0.16),0_6px_12px_-4px_rgba(15,23,42,0.08)]",
        fullPage
          ? "h-full w-full gap-3 border-[3px] px-1.5"
          : compact
            ? "h-full w-full gap-1 border-2 px-1.5"
            : "gap-2.5 border-[3px] px-2 py-4 sm:gap-3 sm:py-5",
        className,
      )}
    >
      <CategoryIcon category={category} compact={compact} fullPage={fullPage} />
      <p
        className={cn(
          "text-foreground w-full text-center leading-tight",
          fullPage
            ? "text-sm font-semibold"
            : compact
              ? "text-[11px] font-medium"
              : "text-sm font-semibold",
        )}
      >
        {category.name}
      </p>
    </Link>
  );
}

export function MoreCategoryItem({ compact = false, className }) {
  return (
    <Link
      href={ROUTES.CATEGORIES}
      className={cn(
        "group flex min-w-0 flex-col items-center justify-center rounded-2xl border-white bg-[#FDE8F3] shadow-[0_8px_20px_-4px_rgba(15,23,42,0.12),0_4px_8px_-4px_rgba(15,23,42,0.06)] transition-all hover:scale-[1.02] hover:shadow-[0_12px_28px_-4px_rgba(15,23,42,0.16),0_6px_12px_-4px_rgba(15,23,42,0.08)]",
        compact
          ? "h-full w-full gap-1 border-2 px-1.5"
          : "gap-2.5 border-[3px] px-2 py-4 sm:gap-3 sm:py-5",
        className,
      )}
    >
      <img
        src="/icons/11.svg"
        alt=""
        className={cn("object-contain", compact ? "size-9" : "size-10 sm:size-11")}
        loading="lazy"
      />
      <p
        className={cn(
          "text-foreground w-full text-center leading-tight",
          compact ? "text-[11px] font-medium" : "text-sm font-semibold",
        )}
      >
        More
      </p>
    </Link>
  );
}
