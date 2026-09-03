"use client";

import { Check, ChevronLeft, ChevronRight } from "lucide-react";

import {
  VisitHomeIcon,
  VisitOnlineIcon,
  VisitOnsiteIcon,
} from "@/components/icons/visit-type-icons";
import { timeSlots } from "@/mock/appointments";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";

export const PACKAGE_VISIT_TYPES = [
  { value: "in_clinic", label: "Onsite", icon: VisitOnsiteIcon },
  { value: "online", label: "Online", icon: VisitOnlineIcon },
  { value: "home_visit", label: "Homevisit", icon: VisitHomeIcon },
];

export function getPackageDateRange(count, startOffset = 0) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + startOffset + index);
    return date;
  });
}

export function PackageSectionTitle({ children, action, className }) {
  return (
    <div
      className={cn("mb-3 flex items-center justify-between gap-4 md:mb-4", className)}
    >
      <h2 className="text-foreground min-w-0 text-base font-semibold md:text-lg md:font-bold">
        {children}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PackageSectionPanel({ children, className }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-sky-100 bg-[#F4F8FF] p-3.5 md:p-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function MonthNavigator({
  monthLabel,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
}) {
  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button
        type="button"
        onClick={onPrev}
        disabled={disablePrev}
        className="border-border/60 bg-background text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-[#F8F9FC] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Scroll to previous dates"
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="text-foreground min-w-[5.25rem] px-1 text-center text-sm font-semibold whitespace-nowrap tabular-nums">
        {monthLabel}
      </span>
      <button
        type="button"
        onClick={onNext}
        disabled={disableNext}
        className="border-border/60 bg-background text-foreground flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors hover:bg-[#F8F9FC] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Scroll to next dates"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

export function DatePickerRow({
  dates,
  selectedDate,
  onSelect,
  scrollRef,
  onScroll,
  className,
}) {
  return (
    <div
      ref={scrollRef}
      onScroll={onScroll}
      className={cn(
        "scrollbar-hide touch-pan-x overflow-x-auto overscroll-x-contain scroll-smooth",
        className,
      )}
    >
      <div className="flex w-max gap-2 md:gap-2.5">
        {dates.map((date) => {
          const iso = getLocalDateKey(date);
          const selected = selectedDate === iso;
          return (
            <button
              key={iso}
              type="button"
              onClick={() => onSelect(iso)}
              className={cn(
                "flex min-h-[4.25rem] min-w-[3.35rem] shrink-0 flex-col items-center justify-center rounded-xl border px-2.5 py-2.5 transition-colors",
                selected
                  ? "border-primary text-primary bg-[#EFF6FF] shadow-[0_0_0_1px_rgba(24,101,234,0.08)]"
                  : "border-border bg-background text-foreground hover:border-primary/25 hover:bg-[#F8FAFC]",
              )}
            >
              <span
                className={cn(
                  "text-base leading-none font-bold",
                  selected ? "text-primary" : "text-foreground",
                )}
              >
                {String(date.getDate()).padStart(2, "0")}
              </span>
              <span
                className={cn(
                  "mt-1.5 text-xs font-medium",
                  selected ? "text-primary" : "text-muted-foreground",
                )}
              >
                {date.toLocaleDateString("en", { weekday: "short" })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimePickerGrid({ selectedTime, onSelect, columns = "grid-cols-4" }) {
  return (
    <div className={cn("grid gap-2 md:gap-2.5", columns)}>
      {timeSlots.map((slot) => {
        const selected = selectedTime === slot.time;
        return (
          <button
            key={slot.id}
            type="button"
            disabled={!slot.available}
            onClick={() => onSelect(slot.time)}
            className={cn(
              "rounded-xl border px-1 py-2.5 text-xs font-semibold transition-colors sm:text-sm",
              !slot.available && "cursor-not-allowed opacity-40",
              selected
                ? "border-primary bg-background text-primary shadow-sm"
                : "bg-background/80 text-muted-foreground hover:border-primary/20 hover:text-foreground border-transparent",
            )}
          >
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}

export function PackageInfoCard({ pkg, theme }) {
  return (
    <article className="border-border/60 bg-background shadow-card rounded-2xl border p-4 md:p-5">
      <div className="flex items-stretch gap-3.5 md:gap-5">
        <div className="bg-muted min-h-[7rem] w-[4.75rem] shrink-0 overflow-hidden rounded-xl md:min-h-[8.5rem] md:w-[7rem]">
          <img src={pkg.image} alt={pkg.name} className="size-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-foreground text-base leading-snug font-semibold md:text-lg md:font-bold">
              {pkg.name}
            </h2>
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold md:px-2.5 md:py-1 md:text-xs",
                theme.badge,
              )}
            >
              Save {pkg.discountPercent}%
            </span>
          </div>

          <ul className="mt-3 space-y-2 md:mt-4 md:space-y-2.5">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                    theme.checkBg,
                  )}
                >
                  <Check className="size-2.5 text-white" strokeWidth={3} />
                </span>
                <span className="text-muted-foreground leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

export function VisitTypePicker({ visitType, onSelect }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 md:gap-3">
      {PACKAGE_VISIT_TYPES.map(({ value, label, icon: Icon }) => {
        const selected = visitType === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect(value)}
            className={cn(
              "flex flex-col items-center gap-2.5 rounded-xl border px-2 py-3.5 transition-colors md:py-4",
              selected
                ? "border-[#C3F4DC] bg-[#F7FFFB]"
                : "border-border/70 bg-background hover:border-primary/20",
            )}
          >
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-lg md:size-12",
                selected
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              <Icon className="size-6" />
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                selected ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
