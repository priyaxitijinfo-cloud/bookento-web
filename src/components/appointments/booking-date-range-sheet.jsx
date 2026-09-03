"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { getLocalDateKey } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const QUICK_RANGES = [
  { id: "today", label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last7", label: "Last 7 Days" },
  { id: "last30", label: "Last 30 Days" },
];

function buildQuickRange(id) {
  const today = new Date();
  const todayKey = getLocalDateKey(today);

  if (id === "today") {
    return { start: todayKey, end: todayKey };
  }

  if (id === "yesterday") {
    const key = getLocalDateKey(subDays(today, 1));
    return { start: key, end: key };
  }

  if (id === "last7") {
    return { start: getLocalDateKey(subDays(today, 6)), end: todayKey };
  }

  if (id === "last30") {
    return { start: getLocalDateKey(subDays(today, 29)), end: todayKey };
  }

  return null;
}

function normalizeRange(start, end) {
  if (!start) return null;
  if (!end || end < start) {
    return { start, end: start };
  }
  return { start, end };
}

function getRangeDayCount(range) {
  if (!range?.start) return 0;
  const end = range.end || range.start;
  const startDate = parseISO(`${range.start}T00:00:00`);
  const endDate = parseISO(`${end}T00:00:00`);
  return differenceInCalendarDays(endDate, startDate) + 1;
}

function formatRangeLabel(range) {
  if (!range?.start) return "";
  const end = range.end || range.start;
  const startLabel = format(parseISO(`${range.start}T00:00:00`), "d MMM yyyy");
  if (range.start === end) return startLabel;
  const endLabel = format(parseISO(`${end}T00:00:00`), "d MMM yyyy");
  return `${startLabel} - ${endLabel}`;
}

export function isAppointmentInDateRange(scheduledDate, range) {
  if (!range?.start) return true;
  const end = range.end || range.start;
  return scheduledDate >= range.start && scheduledDate <= end;
}

function QuickRangeChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium whitespace-nowrap transition-colors",
        active
          ? "text-primary bg-[#E4EEFF]"
          : "bg-[#F2F6FC] text-[#4D5972] hover:bg-[#E8EEF8]",
      )}
    >
      {children}
    </button>
  );
}

export function BookingDateRangeSheet({ open, onClose, value, onApply }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [activeQuick, setActiveQuick] = useState(null);

  useEffect(() => {
    if (!open) return;
    setDraftStart(value?.start ?? null);
    setDraftEnd(value?.end ?? null);
    setActiveQuick(null);
    if (value?.start) {
      setVisibleMonth(startOfMonth(parseISO(`${value.start}T00:00:00`)));
    } else {
      setVisibleMonth(startOfMonth(new Date()));
    }
  }, [open, value]);

  const draftRange = useMemo(
    () => normalizeRange(draftStart, draftEnd),
    [draftStart, draftEnd],
  );

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);

    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [visibleMonth]);

  if (!open) return null;

  const handleDayClick = (dateKey) => {
    setActiveQuick(null);

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(dateKey);
      setDraftEnd(null);
      return;
    }

    if (dateKey < draftStart) {
      setDraftEnd(draftStart);
      setDraftStart(dateKey);
      return;
    }

    setDraftEnd(dateKey);
  };

  const handleQuickRange = (id) => {
    const nextRange = buildQuickRange(id);
    if (!nextRange) return;
    setActiveQuick(id);
    setDraftStart(nextRange.start);
    setDraftEnd(nextRange.end);
    setVisibleMonth(startOfMonth(parseISO(`${nextRange.start}T00:00:00`)));
  };

  const handleClear = () => {
    setDraftStart(null);
    setDraftEnd(null);
    setActiveQuick(null);
  };

  const handleApply = () => {
    onApply(draftRange);
    onClose();
  };

  const dayCount = getRangeDayCount(draftRange);
  const rangeLabel = formatRangeLabel(draftRange);

  const header = (
    <div className="flex shrink-0 items-center justify-between px-5 pt-2 pb-4">
      <h2 className="text-foreground text-[1.125rem] leading-none font-bold">
        Select Date Range
      </h2>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleClear}
          className="text-primary text-sm font-semibold transition-opacity hover:opacity-80"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full bg-[#F2F4F7] text-[#4D5972] transition-colors hover:bg-[#E8EBF0]"
          aria-label="Close"
        >
          <X className="size-[1.125rem]" strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );

  const body = (
    <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-4 md:flex-none md:overflow-visible">
      <div className="scrollbar-hide -mx-5 flex gap-2 overflow-x-auto px-5 pb-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
        {QUICK_RANGES.map((item) => (
          <QuickRangeChip
            key={item.id}
            active={activeQuick === item.id}
            onClick={() => handleQuickRange(item.id)}
          >
            {item.label}
          </QuickRangeChip>
        ))}
      </div>

      {draftRange ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-[#BFD6FF] bg-[#EFF6FF] px-4 py-3">
          <div>
            <p className="text-xs font-medium text-[#7A8699]">Selected Duration</p>
            <p className="text-foreground mt-1 text-base font-semibold md:font-bold">
              {rangeLabel}
            </p>
          </div>
          <span className="gradient-brand inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-full px-3 text-xs font-medium text-white md:font-semibold">
            {dayCount} {dayCount === 1 ? "day" : "days"}
          </span>
        </div>
      ) : (
        <div className="mb-4 rounded-xl bg-[#F4F8FF] px-4 py-3 text-center">
          <p className="text-primary/80 text-sm font-medium">
            Please select a date range below
          </p>
        </div>
      )}

      <div className="pb-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-foreground text-base font-semibold md:font-bold">
            {format(visibleMonth, "MMMM, yyyy")}
          </h3>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => subMonths(month, 1))}
              className="flex size-8 items-center justify-center rounded-full text-[#4D5972] transition-colors hover:bg-[#F2F4F7]"
              aria-label="Previous month"
            >
              <ChevronLeft className="size-5" strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
              className="flex size-8 items-center justify-center rounded-full text-[#4D5972] transition-colors hover:bg-[#F2F4F7]"
              aria-label="Next month"
            >
              <ChevronRight className="size-5" strokeWidth={2.25} />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-y-1">
          {WEEKDAY_LABELS.map((label, index) => (
            <div
              key={label}
              className={cn(
                "py-1 text-center text-xs font-semibold",
                index === 0 || index === 6 ? "text-primary" : "text-[#4D5972]",
              )}
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {calendarDays.map((day) => {
            const dateKey = getLocalDateKey(day);
            const isCurrentMonth = isSameMonth(day, visibleMonth);
            const isToday = isSameDay(day, new Date());
            const range = normalizeRange(draftStart, draftEnd);
            const rangeEnd = range?.end || range?.start;
            const isInRange =
              range?.start && dateKey >= range.start && dateKey <= rangeEnd;
            const isRangeStart = range?.start === dateKey;
            const isRangeEnd = rangeEnd === dateKey;
            const isSingleSelected = isRangeStart && isRangeEnd;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => handleDayClick(dateKey)}
                className={cn(
                  "relative flex h-11 items-center justify-center text-sm transition-colors",
                  !isCurrentMonth && "text-[#CBD5E1]",
                  isCurrentMonth && !isInRange && "text-[#1F2937]",
                  isInRange && !isSingleSelected && "text-primary bg-[#EAF2FF]",
                  isRangeStart && !isSingleSelected && "rounded-l-full bg-[#EAF2FF]",
                  isRangeEnd && !isSingleSelected && "rounded-r-full bg-[#EAF2FF]",
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full",
                    isSingleSelected && "gradient-brand text-white",
                    isToday && !isInRange && "ring-primary ring-1 ring-inset",
                    isInRange &&
                      !isSingleSelected &&
                      (isRangeStart || isRangeEnd) &&
                      "gradient-brand text-white",
                  )}
                >
                  {day.getDate()}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const footer = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleClear}
        className="h-12 flex-1 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#4D5972] transition-colors hover:bg-[#E8EBF0]"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={handleApply}
        className="gradient-brand h-12 flex-1 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
      >
        Apply Filter
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile — bottom sheet */}
      <div className="fixed inset-0 z-50 flex items-end justify-center md:hidden">
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-label="Close date range picker"
        />

        <div className="relative flex max-h-[92dvh] w-full flex-col rounded-t-[1.375rem] bg-white shadow-[0_-8px_40px_rgba(15,23,42,0.12)]">
          <div className="flex shrink-0 justify-center pt-3 pb-1">
            <span aria-hidden className="h-1 w-[2.75rem] rounded-full bg-[#D1D5DB]" />
          </div>
          {header}
          {body}
          <div className="shrink-0 border-t border-[#F0F0F0] px-5 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
            {footer}
          </div>
        </div>
      </div>

      {/* Desktop — centered popup (not drawer) */}
      <div className="fixed inset-0 z-50 hidden items-center justify-center p-6 md:flex">
        <button
          type="button"
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={onClose}
          aria-label="Close date range picker"
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Select Date Range"
          className="relative flex w-full max-w-[26rem] flex-col rounded-2xl bg-white shadow-[0_24px_64px_rgba(15,23,42,0.22)]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="pt-4">{header}</div>
          {body}
          <div className="shrink-0 border-t border-[#F0F0F0] px-5 py-4">{footer}</div>
        </div>
      </div>
    </>
  );
}
