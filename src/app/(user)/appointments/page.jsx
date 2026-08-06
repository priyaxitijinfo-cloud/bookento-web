"use client";

import { useMemo, useState } from "react";
import { LayoutList } from "lucide-react";

import { BookingEmptyState } from "@/components/appointments/booking-empty-state";
import { BookingListCard } from "@/components/appointments/booking-list-card";
import { BookingTabBar } from "@/components/appointments/booking-tab-bar";
import { BookingsCalendarView } from "@/components/appointments/bookings-calendar-view";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { ROUTES } from "@/constants/routes.constants";
import { appointments } from "@/mock/appointments";
import { useFilterStore } from "@/store";
import { cn } from "@/lib/utils";

const TAB_STATUS_MAP = {
  pending: [APPOINTMENT_STATUS.PENDING],
  confirm: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.UPCOMING],
  cancelled: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.REJECTED],
  completed: [APPOINTMENT_STATUS.COMPLETED],
};

function ViewToggleButton({ viewMode, onToggle }) {
  const isCalendar = viewMode === "calendar";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isCalendar ? "Show list view" : "Show calendar view"}
      aria-pressed={isCalendar}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors md:size-10",
        isCalendar
          ? "profile-tab-active text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
          : "bg-[#EFF6FF] text-[#1865EA] hover:bg-[#DBEAFE]",
      )}
    >
      {isCalendar ? (
        <LayoutList className="size-5" />
      ) : (
        <img src="/icons/calender01.svg" alt="" className="size-5" aria-hidden />
      )}
    </button>
  );
}

export default function AppointmentsPage() {
  const { appointmentTab, setAppointmentTab } = useFilterStore();
  const [viewMode, setViewMode] = useState("list");

  const grouped = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(TAB_STATUS_MAP).map(([tab, statuses]) => [
          tab,
          appointments.filter((appointment) => statuses.includes(appointment.status)),
        ]),
      ),
    [],
  );

  const activeList = grouped[appointmentTab] ?? [];
  const counts = Object.fromEntries(
    Object.entries(grouped).map(([tab, list]) => [tab, list.length]),
  );

  const toggleView = () => {
    setViewMode((mode) => (mode === "list" ? "calendar" : "list"));
  };

  return (
    <UserPageShell
      title="My Bookings"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page"
      rightAction={<ViewToggleButton viewMode={viewMode} onToggle={toggleView} />}
    >
      <BookingTabBar value={appointmentTab} onChange={setAppointmentTab} counts={counts} />

      <div className="mt-[11px] md:mt-[15px]">
        {activeList.length === 0 ? (
          <BookingEmptyState tab={appointmentTab} />
        ) : viewMode === "calendar" ? (
          <BookingsCalendarView appointments={activeList} />
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
            {activeList.map((appointment) => (
              <BookingListCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </UserPageShell>
  );
}
