"use client";

import { LayoutList } from "lucide-react";

import { BookingEmptyState } from "@/components/appointments/booking-empty-state";
import { BookingListCard } from "@/components/appointments/booking-list-card";
import { BookingTabBar } from "@/components/appointments/booking-tab-bar";
import { BookingsCalendarView } from "@/components/appointments/bookings-calendar-view";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function ViewToggleButton({ viewMode, onToggle }) {
  const isCalendar = viewMode === "calendar";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isCalendar ? "Show list view" : "Show calendar view"}
      aria-pressed={isCalendar}
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-colors",
        isCalendar
          ? "profile-tab-active text-white shadow-[0_2px_8px_rgba(24,101,234,0.22)]"
          : "bg-[#FFFFFF] hover:bg-[#FFFFFF]",
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

export function AppointmentsMobile({
  appointmentTab,
  setAppointmentTab,
  viewMode,
  toggleView,
  activeList,
  counts,
}) {
  return (
    <UserPageShell
      title="My Bookings"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      containerVariant="browseWithBreadcrumb"
      className="bg-background"
      rightAction={<ViewToggleButton viewMode={viewMode} onToggle={toggleView} />}
    >
      <BookingTabBar value={appointmentTab} onChange={setAppointmentTab} counts={counts} />

      <div className="mt-[11px]">
        {activeList.length === 0 ? (
          <BookingEmptyState tab={appointmentTab} />
        ) : viewMode === "calendar" ? (
          <BookingsCalendarView appointments={activeList} />
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {activeList.map((appointment) => (
              <BookingListCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        )}
      </div>
    </UserPageShell>
  );
}
