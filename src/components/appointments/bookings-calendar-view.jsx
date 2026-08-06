"use client";

import { useMemo, useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { BookingListCard } from "@/components/appointments/booking-list-card";
import { getLocalDateKey } from "@/utils/format.utils";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function BookingsCalendarView({ appointments }) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey(new Date()));

  const appointmentDateSet = useMemo(
    () => new Set(appointments.map((appointment) => appointment.scheduledDate)),
    [appointments],
  );

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);

    return eachDayOfInterval({
      start: startOfWeek(monthStart),
      end: endOfWeek(monthEnd),
    });
  }, [visibleMonth]);

  const selectedAppointments = useMemo(
    () => appointments.filter((appointment) => appointment.scheduledDate === selectedDate),
    [appointments, selectedDate],
  );

  const selectedDateLabel = useMemo(() => {
    const parsed = new Date(`${selectedDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return "Selected date";
    return format(parsed, "EEEE, MMM d");
  }, [selectedDate]);

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4">
      <section className="bg-card overflow-hidden rounded-2xl p-4 shadow-card ring-1 ring-border md:p-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setVisibleMonth((month) => subMonths(month, 1))}
            className="text-primary flex size-9 items-center justify-center rounded-lg bg-primary/10 transition-colors hover:bg-primary/15"
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <h2 className="text-foreground text-base font-bold md:text-lg">
            {format(visibleMonth, "MMMM yyyy")}
          </h2>
          <button
            type="button"
            onClick={() => setVisibleMonth((month) => addMonths(month, 1))}
            className="text-primary flex size-9 items-center justify-center rounded-lg bg-primary/10 transition-colors hover:bg-primary/15"
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <div key={label} className="text-muted-foreground py-1 text-center text-xs font-semibold">
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dateKey = getLocalDateKey(day);
            const isCurrentMonth = isSameMonth(day, visibleMonth);
            const isSelected = dateKey === selectedDate;
            const isToday = isSameDay(day, new Date());
            const hasBooking = appointmentDateSet.has(dateKey);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDate(dateKey)}
                className={cn(
                  "flex min-h-11 flex-col items-center justify-center rounded-xl border text-sm transition-colors",
                  !isCurrentMonth && "text-muted-foreground/50",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-semibold"
                    : "border-transparent hover:border-border hover:bg-muted/60",
                  isToday && !isSelected && "border-primary/30 text-primary",
                )}
              >
                <span>{day.getDate()}</span>
                {hasBooking ? (
                  <span
                    className={cn(
                      "mt-1 size-1.5 rounded-full",
                      isSelected ? "bg-primary" : "bg-primary/70",
                    )}
                  />
                ) : (
                  <span className="mt-1 size-1.5" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-foreground mb-3 text-sm font-bold md:text-base">{selectedDateLabel}</h3>
        {selectedAppointments.length === 0 ? (
          <div className="bg-card text-muted-foreground rounded-2xl border border-dashed border-border px-4 py-8 text-center text-sm">
            No bookings on this date.
          </div>
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {selectedAppointments.map((appointment) => (
              <BookingListCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
