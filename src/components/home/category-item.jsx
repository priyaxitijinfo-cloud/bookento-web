import Link from "next/link";

import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

export function CategoryIcon({ category, compact = false, fullPage = false }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 bg-current",
        category.iconColor,
        fullPage ? "size-[42px]" : compact ? "size-9" : "size-10 sm:size-11",
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

export function CategoryItem({ category, compact = false, fullPage = false, className }) {
  return (
    <Link
      href={categoryListingRoute(category.slug)}
      className={cn(
        category.bg,
        "group flex min-w-0 flex-col items-center justify-center rounded-2xl border-white shadow-card transition-transform hover:scale-[1.02]",
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
          fullPage ? "text-sm font-semibold" : compact ? "text-[11px] font-medium" : "text-sm font-semibold",
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
        "group flex min-w-0 flex-col items-center justify-center rounded-2xl border-white bg-[#FDE8F3] shadow-card transition-transform hover:scale-[1.02]",
        compact ? "h-full w-full gap-1 border-2 px-1.5" : "gap-2.5 border-[3px] px-2 py-4 sm:gap-3 sm:py-5",
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
