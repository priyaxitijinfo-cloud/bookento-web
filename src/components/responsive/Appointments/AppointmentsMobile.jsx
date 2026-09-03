"use client";

import { useMemo, useState } from "react";

import {
  BookingDateRangeSheet,
  isAppointmentInDateRange,
} from "@/components/appointments/booking-date-range-sheet";
import { BookingEmptyState } from "@/components/appointments/booking-empty-state";
import { BookingListCard } from "@/components/appointments/booking-list-card";
import { BookingTabBar } from "@/components/appointments/booking-tab-bar";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function MobileDateRangeButton({ active, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Select date range"
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors",
        active
          ? "profile-tab-active text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
          : "text-[#1865EA]",
      )}
    >
      <img src="/icons/calender01.svg" alt="" className="size-5" aria-hidden />
    </button>
  );
}

export function AppointmentsMobile({ appointmentTab, setAppointmentTab, activeList }) {
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const filteredList = useMemo(
    () =>
      activeList.filter((appointment) =>
        isAppointmentInDateRange(appointment.scheduledDate, dateRange),
      ),
    [activeList, dateRange],
  );

  const hasDateFilter = Boolean(dateRange?.start);

  return (
    <>
      <UserPageShell
        title="My Bookings"
        backHref={ROUTES.HOME}
        backLabel="Back to Home"
        hideMobileBack
        containerVariant="browseWithBreadcrumb"
        className="bg-background"
        rightAction={
          <MobileDateRangeButton
            active={hasDateFilter}
            onOpen={() => setDateRangeOpen(true)}
          />
        }
      >
        <BookingTabBar value={appointmentTab} onChange={setAppointmentTab} />

        <div className="mt-[11px]">
          {filteredList.length === 0 ? (
            <BookingEmptyState tab={appointmentTab} />
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredList.map((appointment) => (
                <BookingListCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          )}
        </div>
      </UserPageShell>

      <BookingDateRangeSheet
        open={dateRangeOpen}
        onClose={() => setDateRangeOpen(false)}
        value={dateRange}
        onApply={setDateRange}
      />
    </>
  );
}
