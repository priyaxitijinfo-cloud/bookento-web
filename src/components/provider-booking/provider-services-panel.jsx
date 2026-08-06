"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Monitor,
} from "lucide-react";

import { LocationIcon } from "@/components/icons/location-icon";
import { ServiceSelectCard } from "@/components/provider-booking/service-select-card";
import { SectionHeading, TabPanelHeader } from "@/components/provider-booking/shared";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { timeSlots } from "@/mock/appointments";
import { useBookingStore } from "@/store";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";

const VISIT_TYPES = [
  { value: "in_clinic", label: "Onsite", icon: LocationIcon },
  { value: "online", label: "Online", icon: Monitor },
  { value: "home_visit", label: "Homevisit", icon: Home },
];

function getDateRange(count, startOffset = 0) {
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + startOffset + index);
    return date;
  });
}

export function ProviderServicesPanel({ services, onSeeAllServices }) {
  const {
    draft,
    setVisitType,
    toggleService,
    setBranchId,
    setScheduledDate,
    setScheduledTime,
  } = useBookingStore();

  const [dateOffset, setDateOffset] = useState(0);
  const dates = useMemo(() => getDateRange(14, dateOffset), [dateOffset]);

  const monthLabel = dates[0]?.toLocaleDateString("en", { month: "long", year: "numeric" }) || "";

  const handleSelectDate = (date) => {
    setScheduledDate(getLocalDateKey(date));
  };

  return (
    <div className="space-y-5">
      <TabPanelHeader
        title="Book a Consultation"
        description="Choose visit type, select services, and pick your preferred date, time, and branch."
      />

      <section className="rounded-lg border border-border/60 bg-background p-4 md:p-5">
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
                    selected ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
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

      <section className="rounded-lg border border-border/60 bg-background p-4 md:p-5">
        <SectionHeading
          title="Services"
          action={
            onSeeAllServices && services.length > 0 ? (
              <button
                type="button"
                onClick={onSeeAllServices}
                className="text-primary inline-flex items-center gap-1 text-sm font-semibold transition-colors hover:text-primary/80"
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

      <section className="rounded-lg border border-border/60 bg-background p-4 md:p-5">
        <SectionHeading title="Select Date & Time" />

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold capitalize text-foreground">{monthLabel}</p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setDateOffset((offset) => Math.max(0, offset - 7))}
                disabled={dateOffset === 0}
                className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-[#F8F9FC] text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous dates"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => setDateOffset((offset) => offset + 7)}
                className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-[#F8F9FC] text-foreground transition-colors hover:bg-accent"
                aria-label="Next dates"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2.5 text-xs font-medium uppercase tracking-wide">Select Date</p>
            <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
              {dates.map((date) => {
                const iso = getLocalDateKey(date);
                const isSelected = draft.scheduledDate === iso;
                return (
                  <button
                    key={iso}
                    type="button"
                    onClick={() => handleSelectDate(date)}
                    className={cn(
                      "flex min-w-[3.25rem] flex-col items-center rounded-lg border px-2.5 py-2.5 text-xs font-medium transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border/60 bg-[#F8F9FC] text-muted-foreground hover:border-primary/30 hover:bg-background",
                    )}
                  >
                    <span className="text-base font-bold leading-none">{String(date.getDate()).padStart(2, "0")}</span>
                    <span className="mt-1">{date.toLocaleDateString("en", { weekday: "short" })}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2.5 text-xs font-medium uppercase tracking-wide">Select Time</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {timeSlots.slice(0, 10).map((slot) => {
                const isSelected = draft.scheduledTime === slot.time;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setScheduledTime(slot.time)}
                    className={cn(
                      "appearance-none rounded-lg px-2 py-2.5 text-xs font-semibold outline-none sm:text-sm",
                      "select-none focus-visible:ring-2 focus-visible:ring-primary/25 active:scale-[0.98]",
                      !slot.available && "cursor-not-allowed opacity-40",
                      isSelected
                        ? "profile-tab-active border-0 shadow-[0_4px_14px_rgba(24,101,234,0.25)] transition-[box-shadow,transform] hover:shadow-[0_6px_18px_rgba(24,101,234,0.35)]"
                        : "border border-border/60 bg-[#F8F9FC] text-muted-foreground transition-colors hover:border-primary/30 hover:bg-background hover:text-foreground",
                    )}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border/60 bg-background p-4 md:p-5">
        <SectionHeading title="Select Branch" />
        <div className="space-y-2.5" role="radiogroup" aria-label="Select branch">
          {PROVIDER_BRANCHES.map((branch) => {
            const selected = draft.branchId === branch.id;
            return (
              <button
                key={branch.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setBranchId(branch.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors",
                  selected
                    ? "border-[#C3F4DC] bg-[#F7FFFB]"
                    : "border-border bg-background hover:border-primary/20",
                )}
              >
                <LocationIcon
                  className={cn(
                    "size-5 shrink-0",
                    selected ? "text-emerald-500" : "text-muted-foreground",
                  )}
                  strokeWidth={2}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-foreground">{branch.name}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{branch.address}</p>
                </div>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    selected
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-border bg-background",
                  )}
                  aria-hidden
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
