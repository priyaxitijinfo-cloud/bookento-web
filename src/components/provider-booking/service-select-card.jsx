"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatCurrency, formatDuration } from "@/utils/format.utils";

export function ServiceSelectCard({ service, selected, onToggle }) {
  const hasDiscount = service.originalPrice > service.price;

  return (
    <label
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
        selected
          ? "border-[#C3F4DC] bg-[#F7FFFB]"
          : "border-border bg-background hover:border-primary/20",
      )}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="peer sr-only"
        aria-label={`Select ${service.name}`}
      />
      <span
        className={cn(
          "flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-2 transition-colors",
          "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/30",
          selected
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-muted-foreground/35 bg-background",
        )}
        aria-hidden
      >
        {selected && <Check className="size-3" strokeWidth={3} />}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-foreground">{service.name}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">{formatDuration(service.duration)}</p>
      </div>
      <div className="shrink-0 text-right">
        {hasDiscount && (
          <p className="text-muted-foreground text-xs line-through">
            {formatCurrency(service.originalPrice)}
          </p>
        )}
        <p className={cn("text-sm font-bold", selected ? "text-emerald-500" : "text-foreground")}>
          {formatCurrency(service.price)}
        </p>
      </div>
    </label>
  );
}
