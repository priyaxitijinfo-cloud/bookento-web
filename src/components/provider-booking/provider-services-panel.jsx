"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import {
  VisitHomeIcon,
  VisitOnlineIcon,
  VisitOnsiteIcon,
} from "@/components/icons/visit-type-icons";
import { ServiceSelectCard } from "@/components/provider-booking/service-select-card";
import { SectionHeading } from "@/components/provider-booking/shared";
import { timeSlots } from "@/mock/appointments";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";

const VISIT_TYPES = [
  { value: "in_clinic", label: "Onsite", icon: VisitOnsiteIcon },
  { value: "online", label: "Online", icon: VisitOnlineIcon },
  { value: "home_visit", label: "Homevisit", icon: VisitHomeIcon },
];

function startOfDay(date) {
  const next = new Date(date);
  next.setHours(12, 0, 0, 0);
  return next;
}

function getMonthDates(year, month) {
  const today = startOfDay(new Date());
  const monthStart = startOfDay(new Date(year, month, 1));
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
  const start = isCurrentMonth ? today : monthStart;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const startDay = start.getDate();
  const count = Math.max(1, lastDay - startDay + 1);

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

export function ProviderServicesPanel({ services, onSeeAllServices }) {
  const { draft, setVisitType, toggleService, setScheduledDate, setScheduledTime } =
    useBookingStore();

  const today = useMemo(() => startOfDay(new Date()), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const dates = useMemo(
    () => getMonthDates(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  const monthLabel = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString("en", {
      month: "long",
      year: "numeric",
    })
    .replace(" ", ", ");

  const canGoPrev =
    viewYear > today.getFullYear() ||
    (viewYear === today.getFullYear() && viewMonth > today.getMonth());

  const goToPrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((year) => year - 1);
      return;
    }
    setViewMonth((month) => month - 1);
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((year) => year + 1);
      return;
    }
    setViewMonth((month) => month + 1);
  };

  const handleSelectDate = (date) => {
    setScheduledDate(getLocalDateKey(date));
  };

  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="Visit type" />
        <div className="grid grid-cols-3 gap-3">
          {VISIT_TYPES.map(({ value, label, icon: Icon }) => {
            const selected = draft.visitType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setVisitType(value)}
                className={cn(
                  "flex flex-col items-center gap-3 rounded-xl border px-2 py-4 transition-colors",
                  selected
                    ? "border-[#C3F4DC] bg-[#F7FFFB]"
                    : "border-border/70 bg-background hover:border-primary/20",
                )}
              >
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-lg",
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
      </section>

      <section>
        <SectionHeading
          title="Services"
          action={
            onSeeAllServices && services.length > 0 ? (
              <button
                type="button"
                onClick={onSeeAllServices}
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-semibold transition-colors"
              >
                See all
                <ChevronRight className="size-4" />
              </button>
            ) : null
          }
        />

        <div className="space-y-2.5" role="group" aria-label="Select services">
          {services.slice(0, 3).map((service) => {
            const selected = draft.serviceIds.includes(service.id);
            return (
              <ServiceSelectCard
                key={service.id}
                service={service}
                selected={selected}
                onToggle={() => toggleService(service.id)}
              />
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="bg-primary h-4 w-1 shrink-0 rounded-full" aria-hidden />
            <h2 className="text-foreground truncate text-base font-semibold md:text-lg md:font-bold">
              Select Date &amp; Time
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm font-medium text-[#5B6B8C]">
            <button
              type="button"
              onClick={goToPrevMonth}
              disabled={!canGoPrev}
              className="hover:text-foreground flex size-6 items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-4" strokeWidth={2} />
            </button>
            <span className="min-w-[6.75rem] text-center tabular-nums">
              {monthLabel}
            </span>
            <button
              type="button"
              onClick={goToNextMonth}
              className="hover:text-foreground flex size-6 items-center justify-center transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl bg-[#F2F6FC] p-4 md:p-5">
          <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-1">
            {dates.map((date) => {
              const iso = getLocalDateKey(date);
              const isSelected = draft.scheduledDate === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => handleSelectDate(date)}
                  className="flex min-w-[3.25rem] flex-col items-center gap-1.5"
                >
                  <span
                    className={cn(
                      "bg-background flex size-12 items-center justify-center rounded-xl text-base font-bold transition-colors",
                      isSelected
                        ? "border-primary text-primary border-2 md:border"
                        : "text-foreground border border-transparent",
                    )}
                  >
                    {String(date.getDate()).padStart(2, "0")}
                  </span>
                  <span className="text-foreground text-xs font-medium">
                    {date.toLocaleDateString("en", { weekday: "short" })}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-border/70 border-t" aria-hidden />

          <div className="scrollbar-hide flex gap-2.5 overflow-x-auto pb-1 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 lg:grid-cols-5">
            {timeSlots.map((slot) => {
              const isSelected = draft.scheduledTime === slot.time;
              return (
                <button
                  key={slot.id}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setScheduledTime(slot.time)}
                  className={cn(
                    "bg-background shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors",
                    "md:w-full md:shrink md:rounded-lg",
                    "focus-visible:ring-primary/25 focus-visible:ring-2 focus-visible:outline-none",
                    isSelected
                      ? "border-primary text-primary border-2 md:border"
                      : slot.available
                        ? "text-foreground hover:border-primary/30 border border-transparent"
                        : "text-muted-foreground/40 cursor-not-allowed border border-transparent",
                  )}
                  aria-disabled={!slot.available}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
