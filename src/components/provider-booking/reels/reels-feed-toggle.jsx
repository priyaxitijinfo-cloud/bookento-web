"use client";

import { Star } from "lucide-react";

import { ReelsNearbyIcon, ReelsStarIcon } from "@/components/icons/reels-header-icons";
import { LocationIcon } from "@/components/icons/location-icon";
import { cn } from "@/lib/utils";

export function ReelsFeedToggle({ value, onChange, variant = "default" }) {
  const isGlass = variant === "glass";

  return (
    <div
      className={cn(
        "pointer-events-auto relative inline-grid grid-cols-2 rounded-full p-1",
        isGlass
          ? "border border-white/10 bg-black/30 backdrop-blur-xl"
          : "bg-black/45 backdrop-blur-md",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full transition-transform duration-200 ease-out",
          isGlass ? "border border-white/25 bg-white/15" : "bg-white shadow-sm",
          value === "nearby" && "translate-x-full",
        )}
      />
      <button
        type="button"
        onClick={() => onChange("popular")}
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-[5px] rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
          isGlass
            ? value === "popular"
              ? "text-white"
              : "text-white/75 hover:text-white/90"
            : value === "popular"
              ? "text-[#1A1A2E]"
              : "text-white/80 hover:text-white",
        )}
      >
        {isGlass ? (
          <ReelsStarIcon className="size-4" />
        ) : (
          <Star className="size-4 shrink-0 stroke-[1.75]" />
        )}
        Popular
      </button>
      <button
        type="button"
        onClick={() => onChange("nearby")}
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-[5px] rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
          isGlass
            ? value === "nearby"
              ? "text-white"
              : "text-white/75 hover:text-white/90"
            : value === "nearby"
              ? "text-[#1A1A2E]"
              : "text-white/80 hover:text-white",
        )}
      >
        {isGlass ? (
          <ReelsNearbyIcon className="size-4" />
        ) : (
          <LocationIcon className="size-4 shrink-0" strokeWidth={1.75} />
        )}
        Nearby
      </button>
    </div>
  );
}
