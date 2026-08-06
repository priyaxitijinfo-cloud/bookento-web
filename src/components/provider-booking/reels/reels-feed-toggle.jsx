"use client";

import { Star } from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { cn } from "@/lib/utils";

export function ReelsFeedToggle({ value, onChange }) {
  return (
    <div className="pointer-events-auto relative inline-grid grid-cols-2 rounded-full bg-black/40 p-1 backdrop-blur-md">
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full border border-white/20 bg-background/25 shadow-sm transition-transform duration-200 ease-out",
          value === "nearby" && "translate-x-full",
        )}
      />
      <button
        type="button"
        onClick={() => onChange("popular")}
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-[5px] rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          value === "popular" ? "text-white" : "text-white/70 hover:text-white/90",
        )}
      >
        <Star className="size-4 shrink-0 stroke-[1.75]" />
        Popular
      </button>
      <button
        type="button"
        onClick={() => onChange("nearby")}
        className={cn(
          "relative z-10 inline-flex items-center justify-center gap-[5px] rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
          value === "nearby" ? "text-white" : "text-white/70 hover:text-white/90",
        )}
      >
        <LocationIcon className="size-4 shrink-0" strokeWidth={1.75} />
        Nearby
      </button>
    </div>
  );
}
