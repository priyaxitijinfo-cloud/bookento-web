"use client";

import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { cn } from "@/lib/utils";

/**
 * Soft pastel circular badge using existing category SVG icons.
 */
export function FloatingCategoryIcon({
  slug,
  className,
  size = 52,
  delay = "0s",
  style,
}) {
  const category = getHomeCategoryBySlug(slug);
  if (!category) return null;

  const tile = category.iconTile;

  return (
    <div
      className={cn(
        "feature-promo-float absolute flex items-center justify-center rounded-full",
        "shadow-[0_10px_24px_-12px_rgba(15,27,45,0.35)] ring-2 ring-white/90",
        className,
      )}
      style={{
        width: size,
        height: size,
        backgroundColor: `${tile}22`,
        animationDelay: delay,
        ...style,
      }}
      aria-hidden
    >
      <span
        className="block size-[55%]"
        style={{
          backgroundColor: tile,
          WebkitMaskImage: `url(/icons/categories/${slug}.svg)`,
          maskImage: `url(/icons/categories/${slug}.svg)`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
