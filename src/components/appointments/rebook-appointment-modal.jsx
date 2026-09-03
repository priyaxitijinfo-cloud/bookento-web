"use client";

import { useEffect, useMemo, useState } from "react";
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
      monthLabel: `${date.toLocaleDateString("en-US", { month: "short" })}, ${date.getFullYear()}`,
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
  const [monthIndex, setMonthIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState("11:30 AM");

  const dateOptions = useMemo(() => {
    const base = new Date();
    base.setHours(0, 0, 0, 0);

    if (monthIndex === 0) {
      return buildDateOptions(base);
    }

    const firstOfMonth = new Date(base.getFullYear(), base.getMonth() + monthIndex, 1);
    return buildDateOptions(firstOfMonth);
  }, [monthIndex]);

  const monthLabel = useMemo(() => {
    const labelDate = new Date();
    labelDate.setMonth(labelDate.getMonth() + monthIndex);
    return `${labelDate.toLocaleDateString("en-US", { month: "short" })}, ${labelDate.getFullYear()}`;
  }, [monthIndex]);

  const [selectedDate, setSelectedDate] = useState(
    () => buildDateOptions(new Date())[3]?.key ?? buildDateOptions(new Date())[0]?.key,
  );

  useEffect(() => {
    if (!dateOptions.some((option) => option.key === selectedDate)) {
      setSelectedDate(dateOptions[0]?.key);
    }
  }, [dateOptions, selectedDate]);

  if (!open) return null;

  const availableTimes = timeSlots
    .filter((slot) => slot.available)
    .map((slot) => slot.time);

  const handleConfirm = () => {
    onConfirm?.({ date: selectedDate, time: selectedTime });
  };

  const handleClose = () => {
    onClose?.();
  };

  const handlePrevMonth = () => {
    setMonthIndex((value) => Math.max(0, value - 1));
  };

  const handleNextMonth = () => {
    setMonthIndex((value) => value + 1);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
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
        className="bg-background relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] px-5 pt-6 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] max-md:bg-white sm:rounded-[1.75rem] sm:px-6"
      >
        <h2
          id="rebook-appointment-title"
          className="md:text-foreground text-center text-xl font-semibold text-[#111827] md:font-bold"
        >
          Rebook Appointment
        </h2>
        <div className="-mx-5 mt-4 h-px bg-[#E5E7EB] sm:-mx-6 md:hidden" />

        <div className="mt-5">
          <div className="mb-3 flex items-center justify-between max-md:mt-[6px]">
            <p className="md:text-foreground text-sm font-semibold text-[#111827]">
              Select Date
            </p>
            <div className="md:text-primary flex items-center gap-0.5 text-sm font-semibold text-[#1865EA] md:gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                disabled={monthIndex === 0}
                className="flex size-8 items-center justify-center rounded-full outline-none hover:bg-[#F2F6FC] disabled:opacity-40 max-md:size-auto max-md:rounded-none max-md:hover:bg-transparent"
                aria-label="Previous month"
              >
                <ChevronLeft className="size-4 max-md:size-[18px]" />
              </button>
              <span className="min-w-[5.5rem] text-center">{monthLabel}</span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="flex size-8 items-center justify-center rounded-full outline-none hover:bg-[#F2F6FC] max-md:size-auto max-md:rounded-none max-md:hover:bg-transparent"
                aria-label="Next month"
              >
                <ChevronRight className="size-4 max-md:size-[18px]" />
              </button>
            </div>
          </div>

          {/* Mobile: date number in white box, day label underneath */}
          <div className="rounded-xl bg-[#F2F6FC] p-2.5 md:hidden">
            <div className="flex gap-2">
              {dateOptions.map((option) => {
                const isActive = selectedDate === option.key;

                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setSelectedDate(option.key)}
                    className="flex min-w-0 flex-1 flex-col items-center gap-1.5 outline-none"
                  >
                    <span
                      className={cn(
                        "flex h-10 w-full items-center justify-center rounded-md border bg-white text-center text-base leading-none font-medium transition-colors",
                        isActive
                          ? "border-[#1865EA] font-semibold text-[#1865EA]"
                          : "border-transparent text-[#4D5972]",
                      )}
                    >
                      <span className="translate-y-[2px]">{option.date}</span>
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive ? "text-[#1865EA]" : "text-[#64748B]",
                      )}
                    >
                      {option.day}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop/tablet date strip */}
          <div className="hidden md:block">
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
                        ? "border-primary text-primary bg-[#EFF6FF]"
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
        </div>

        <div className="mt-5 max-md:mt-3">
          <p className="md:text-foreground mb-3 text-sm font-semibold text-[#111827]">
            Select Time
          </p>

          <div className="rounded-xl bg-[#F2F6FC] px-2.5 py-3.5 md:hidden">
            <div className="grid grid-cols-4 gap-2">
              {availableTimes.map((time) => {
                const isActive = selectedTime === time;

                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={cn(
                      "rounded-full border bg-white px-1 py-1.5 text-[13px] font-medium transition-colors outline-none max-md:hover:border-transparent max-md:hover:bg-white",
                      isActive
                        ? "border-[#1865EA] font-semibold text-[#1865EA] max-md:hover:border-[#1865EA]"
                        : "border-transparent text-[#4D5972]",
                    )}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="hidden grid-cols-3 gap-2 sm:grid-cols-4 md:grid">
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
                      ? "border-primary text-primary bg-[#EFF6FF]"
                      : "border-border bg-background text-[#374151] hover:border-[#CBD5E1]",
                  )}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-primary mt-4 flex items-start gap-2.5 rounded-xl bg-[#EFF6FF] px-3 py-3 text-sm max-md:bg-[#F2F6FC] max-md:text-[#1E3A8A]">
          <img
            src="/icons/info.svg"
            alt=""
            className="mt-0.5 size-5 shrink-0 md:hidden"
            aria-hidden
            draggable={false}
          />
          <Info className="mt-0.5 hidden size-4 shrink-0 md:block" />
          <p className="max-md:text-[13px] max-md:leading-snug max-md:text-[#4D5972]">
            Your booking will be updated with the new date &amp; time.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="md:bg-muted md:hover:bg-muted h-12 rounded-xl bg-[#F3F4F6] text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6] disabled:opacity-60 max-md:bg-[#F2F6FC] max-md:hover:bg-[#F2F6FC] md:font-semibold md:text-[#374151]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "gradient-brand h-12 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 md:font-semibold",
              loading && "opacity-70",
            )}
          >
            {loading ? (
              "Saving..."
            ) : (
              <>
                <span className="md:hidden">Reschedule</span>
                <span className="hidden md:inline">{confirmLabel}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
