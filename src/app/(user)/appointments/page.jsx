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
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { ROUTES } from "@/constants/routes.constants";
import { useAppointmentStore, useFilterStore } from "@/store";
import { cn } from "@/lib/utils";

const TAB_STATUS_MAP = {
  pending: [APPOINTMENT_STATUS.PENDING],
  confirm: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.UPCOMING],
  cancelled: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.REJECTED],
  completed: [APPOINTMENT_STATUS.COMPLETED],
};

function DesktopDateRangeButton({ active, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Select date range"
      aria-pressed={active}
      className={cn(
        "hidden size-10 items-center justify-center rounded-full transition-colors md:flex",
        active
          ? "profile-tab-active text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
          : "bg-[#EFF6FF] text-[#1865EA] hover:bg-[#DBEAFE]",
      )}
    >
      <img src="/icons/calender01.svg" alt="" className="size-5" aria-hidden />
    </button>
  );
}

function MobileDateRangeButton({ active, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="Select date range"
      aria-pressed={active}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors md:hidden",
        active
          ? "profile-tab-active text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
          : "text-[#1865EA]",
      )}
    >
      <img src="/icons/calender01.svg" alt="" className="size-5" aria-hidden />
    </button>
  );
}

export default function AppointmentsPage() {
  const { appointmentTab, setAppointmentTab } = useFilterStore();
  const appointments = useAppointmentStore((state) => state.appointments);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  const grouped = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TAB_STATUS_MAP).map(([tab, statuses]) => [
          tab,
          appointments.filter((appointment) => statuses.includes(appointment.status)),
        ]),
      ),
    [appointments],
  );

  const activeList = grouped[appointmentTab] ?? [];

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
        className="bg-surface-page"
        rightAction={
          <>
            <MobileDateRangeButton
              active={hasDateFilter}
              onOpen={() => setDateRangeOpen(true)}
            />
            <DesktopDateRangeButton
              active={hasDateFilter}
              onOpen={() => setDateRangeOpen(true)}
            />
          </>
        }
      >
        <BookingTabBar value={appointmentTab} onChange={setAppointmentTab} />

        <div className="mt-[11px] md:mt-[15px]">
          {filteredList.length === 0 ? (
            <BookingEmptyState tab={appointmentTab} />
          ) : (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
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
