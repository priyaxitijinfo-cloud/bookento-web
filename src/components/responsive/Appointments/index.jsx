"use client";

import { useMemo, useState } from "react";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { appointments } from "@/mock/appointments";
import { useFilterStore } from "@/store";

import { AppointmentsDesktop } from "./AppointmentsDesktop";
import { AppointmentsMobile } from "./AppointmentsMobile";
import { AppointmentsTablet } from "./AppointmentsTablet";

const TAB_STATUS_MAP = {
  pending: [APPOINTMENT_STATUS.PENDING],
  confirm: [APPOINTMENT_STATUS.CONFIRMED, APPOINTMENT_STATUS.UPCOMING],
  cancelled: [APPOINTMENT_STATUS.CANCELLED, APPOINTMENT_STATUS.REJECTED],
  completed: [APPOINTMENT_STATUS.COMPLETED],
};

export function AppointmentsResponsive() {
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

  const sharedProps = {
    appointmentTab,
    setAppointmentTab,
    viewMode,
    toggleView,
    activeList,
    counts,
  };

  return (
    <ResponsiveView
      mobile={<AppointmentsMobile {...sharedProps} />}
      tablet={<AppointmentsTablet {...sharedProps} />}
      desktop={
        <AppointmentsDesktop
          {...sharedProps}
          setViewMode={setViewMode}
          grouped={grouped}
        />
      }
    />
  );
}

export default AppointmentsResponsive;
