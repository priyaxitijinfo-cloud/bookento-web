"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";

import { timeSlots } from "@/mock/appointments";
import { cn } from "@/lib/utils";

function buildDateOptions(baseDate = new Date()) {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(baseDate);
    date.setDate(baseDate.getDate() + index);

    return {
      key: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      date: String(date.getDate()).padStart(2, "0"),
      monthLabel: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    };
  });
}

export function RebookAppointmentModal({
  open,
  onClose,
  onConfirm,
  loading = false,
  confirmLabel = "Reschedule",
}) {
  const dateOptions = useMemo(() => buildDateOptions(), []);
  const [selectedDate, setSelectedDate] = useState(dateOptions[3]?.key ?? dateOptions[0]?.key);
  const [selectedTime, setSelectedTime] = useState("11:30 AM");
  const [monthIndex, setMonthIndex] = useState(0);

  if (!open) return null;

  const monthLabel = dateOptions[0]?.monthLabel ?? "May, 2026";
  const availableTimes = timeSlots.filter((slot) => slot.available).map((slot) => slot.time);

  const handleConfirm = () => {
    onConfirm?.({ date: selectedDate, time: selectedTime });
  };

  const handleClose = () => {
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-label="Close rebook dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="rebook-appointment-title"
        className="relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-[1.75rem] bg-background px-5 pb-6 pt-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:rounded-[1.75rem] sm:px-6"
      >
        <h2 id="rebook-appointment-title" className="text-foreground text-center text-xl font-bold">
          Rebook Appointment
        </h2>

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-foreground text-sm font-semibold">Select Date</p>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <button
                type="button"
                onClick={() => setMonthIndex((value) => Math.max(0, value - 1))}
                className="flex size-8 items-center justify-center rounded-full hover:bg-[#EFF6FF]"
                aria-label="Previous dates"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span>{monthLabel}</span>
              <button
                type="button"
                onClick={() => setMonthIndex((value) => value + 1)}
                className="flex size-8 items-center justify-center rounded-full hover:bg-[#EFF6FF]"
                aria-label="Next dates"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
            {dateOptions.map((option) => {
              const isActive = selectedDate === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSelectedDate(option.key)}
                  className={cn(
                    "flex h-[4.5rem] w-[3.5rem] shrink-0 flex-col items-center justify-center rounded-xl border text-sm transition-colors",
                    isActive
                      ? "border-primary bg-[#EFF6FF] text-primary"
                      : "border-border bg-background text-muted-foreground",
                  )}
                >
                  <span className="text-base font-bold">{option.date}</span>
                  <span className="text-xs font-medium">{option.day}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-foreground mb-3 text-sm font-semibold">Select Time</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableTimes.map((time) => {
              const isActive = selectedTime === time;

              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={cn(
                    "rounded-xl border px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm",
                    isActive
                      ? "border-primary bg-[#EFF6FF] text-primary"
                      : "border-border bg-background text-[#374151] hover:border-[#CBD5E1]",
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#EFF6FF] px-3 py-3 text-sm text-primary">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>Your booking will be updated with the new date &amp; time.</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="h-12 rounded-xl bg-muted text-sm font-semibold text-[#374151] transition-colors hover:bg-muted disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "gradient-brand h-12 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95",
              loading && "opacity-70",
            )}
          >
            {loading ? "Saving..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
