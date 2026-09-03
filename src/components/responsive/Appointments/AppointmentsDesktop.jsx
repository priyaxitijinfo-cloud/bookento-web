"use client";

import Link from "next/link";
import { LayoutList, LayoutGrid } from "lucide-react";

import { BookingEmptyState } from "@/components/appointments/booking-empty-state";
import { BookingListCard } from "@/components/appointments/booking-list-card";
import { BookingTabBar } from "@/components/appointments/booking-tab-bar";
import { BookingsCalendarView } from "@/components/appointments/bookings-calendar-view";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function DesktopBookingsHeader({ viewMode, onToggle }) {
  const isCalendar = viewMode === "calendar";

  return (
    <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center justify-between gap-6 px-6 lg:px-8">
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
          Bookings
        </p>
        <h1 className="text-foreground truncate text-xl font-semibold">My Bookings</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onToggle("list")}
          aria-label="List view"
          aria-pressed={!isCalendar}
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border transition-colors",
            !isCalendar
              ? "border-primary text-primary bg-[#EAF3FF]"
              : "border-border bg-background text-muted-foreground hover:text-primary",
          )}
        >
          <LayoutGrid className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => onToggle("calendar")}
          aria-label="Calendar view"
          aria-pressed={isCalendar}
          className={cn(
            "flex size-10 items-center justify-center rounded-xl border transition-colors",
            isCalendar
              ? "border-primary text-primary bg-[#EAF3FF]"
              : "border-border bg-background text-muted-foreground hover:text-primary",
          )}
        >
          <LayoutList className="size-5" />
        </button>
      </div>
    </div>
  );
}

export function AppointmentsDesktop({
  appointmentTab,
  setAppointmentTab,
  viewMode,
  setViewMode,
  activeList,
  counts,
  grouped,
}) {
  const toggleView = (mode) => setViewMode(mode);

  return (
    <DesktopLayout
      header={<DesktopBookingsHeader viewMode={viewMode} onToggle={toggleView} />}
      maxWidth="wide"
    >
      <div className="grid gap-8 xl:grid-cols-[1fr_280px]">
        <div>
          <BookingTabBar value={appointmentTab} onChange={setAppointmentTab} />

          <div className="mt-6">
            {activeList.length === 0 ? (
              <BookingEmptyState tab={appointmentTab} />
            ) : viewMode === "calendar" ? (
              <BookingsCalendarView appointments={activeList} />
            ) : (
              <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
                {activeList.map((appointment) => (
                  <BookingListCard key={appointment.id} appointment={appointment} />
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <ResponsiveCard>
            <h3 className="text-foreground text-base font-semibold">Overview</h3>
            <div className="mt-4 grid gap-2">
              {Object.entries(counts).map(([tab, count]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAppointmentTab(tab)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                    appointmentTab === tab
                      ? "border-primary/30 text-primary bg-[#EAF3FF]"
                      : "border-border text-foreground hover:border-primary/20 hover:bg-surface-page",
                  )}
                >
                  <span className="capitalize">{tab}</span>
                  <span className="bg-background rounded-full px-2 py-0.5 text-xs font-semibold">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </ResponsiveCard>

          <ResponsiveCard>
            <h3 className="text-foreground text-base font-semibold">Quick links</h3>
            <div className="mt-4 grid gap-2">
              <Link
                href={ROUTES.HOME}
                className="border-border text-foreground hover:border-primary/30 hover:text-primary rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#EAF3FF]"
              >
                Book new appointment
              </Link>
              <Link
                href={ROUTES.PROVIDERS}
                className="border-border text-foreground hover:border-primary/30 hover:text-primary rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors hover:bg-[#EAF3FF]"
              >
                Browse providers
              </Link>
            </div>
          </ResponsiveCard>
        </aside>
      </div>
    </DesktopLayout>
  );
}
