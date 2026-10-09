"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isValid, parseISO } from "date-fns";
import { toast } from "sonner";

import { ProviderAppointmentRequestCard } from "@/features/provider/components/provider-appointment-request-card";
import {
  AcceptRequestModal,
  RejectRequestModal,
} from "@/features/provider/components/provider-request-modals";
import {
  ProviderVisitBadge,
  getScheduleDotClass,
} from "@/features/provider/components/provider-visit-badge";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { ROUTES, providerAppointmentDetailRoute } from "@/constants/routes.constants";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import {
  PROVIDER_DESKTOP_GRID,
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { useAppointmentStore } from "@/store";
import { cn } from "@/lib/utils";
import { getLocalDateKey, isTodayDate } from "@/utils/format.utils";

const TABS = [
  { id: "upcoming", label: "Up-Coming" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const TAB_ACTIVE_CLASS = {
  upcoming: "border-[#1865EA] bg-white text-[#1865EA]",
  pending: "border-[#F97316] bg-[#FFF4ED] text-[#F97316]",
  completed: "border-[#16A34A] bg-white text-[#16A34A]",
  cancelled: "border-[#EF4444] bg-white text-[#EF4444]",
};

function matchesTab(appointment, tab) {
  if (tab === "pending") return appointment.status === APPOINTMENT_STATUS.PENDING;
  if (tab === "completed") return appointment.status === APPOINTMENT_STATUS.COMPLETED;
  if (tab === "cancelled") {
    return (
      appointment.status === APPOINTMENT_STATUS.CANCELLED ||
      appointment.status === APPOINTMENT_STATUS.REJECTED
    );
  }
  return (
    appointment.status === APPOINTMENT_STATUS.UPCOMING ||
    appointment.status === APPOINTMENT_STATUS.CONFIRMED
  );
}

function formatGroupLabel(dateKey) {
  if (!dateKey) return "";
  if (isTodayDate(dateKey)) return "TODAY";
  const parsed = parseISO(dateKey);
  if (!isValid(parsed)) return dateKey;
  return format(parsed, "dd/MM/yyyy");
}

function groupAppointmentsByDate(appointments) {
  const groups = new Map();

  for (const apt of appointments) {
    const key = getLocalDateKey(apt.scheduledDate) || apt.scheduledDate || "unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(apt);
  }

  return [...groups.entries()]
    .sort(([a], [b]) => {
      if (isTodayDate(a)) return -1;
      if (isTodayDate(b)) return 1;
      return a.localeCompare(b);
    })
    .map(([dateKey, items]) => ({
      dateKey,
      label: formatGroupLabel(dateKey),
      items: [...items].sort((left, right) =>
        String(left.scheduledTime || "").localeCompare(
          String(right.scheduledTime || ""),
        ),
      ),
    }));
}

function TimelineAppointmentRow({
  appointment,
  index,
  total,
  showInfo = false,
  onOpen,
}) {
  const [tipOpen, setTipOpen] = useState(false);
  const bookingId = appointment.bookingCode || appointment.bookingId;
  const showBookingId = appointment.showBookingId && bookingId;

  return (
    <li className="relative">
      <button
        type="button"
        onClick={() => onOpen?.(appointment)}
        className="relative flex w-full gap-3 py-3.5 text-left transition-colors hover:bg-[#F8FAFF]"
      >
        <div className="w-[72px] shrink-0 pt-0.5">
          <p className="text-sm font-semibold text-[#374151]">
            {appointment.scheduledTime}
          </p>
        </div>

        <div className="relative flex w-4 shrink-0 flex-col items-center">
          {index < total - 1 && (
            <span className="absolute top-3 bottom-[-14px] w-px bg-[#E5E7EB]" />
          )}
          <span
            className={cn(
              "relative z-10 mt-1.5 size-2.5 rounded-full",
              getScheduleDotClass(appointment.visitType, index),
            )}
          />
        </div>

        <div className="flex min-w-0 flex-1 items-start justify-between gap-2 pr-1">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#111827]">
              {appointment.userName}
            </p>
            <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
              <p className="text-muted-foreground truncate text-xs">
                {appointment.serviceName}
              </p>
              {showInfo && appointment.unavailableReason ? (
                <span
                  role="button"
                  tabIndex={0}
                  className="relative inline-flex shrink-0"
                  onClick={(event) => {
                    event.stopPropagation();
                    setTipOpen((open) => !open);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      setTipOpen((open) => !open);
                    }
                  }}
                  aria-label="Appointment info"
                >
                  <img
                    src={PROVIDER_ICONS.info}
                    alt=""
                    className="size-3.5 object-contain"
                    draggable={false}
                  />
                  {tipOpen ? (
                    <span className="absolute top-5 left-0 z-20 w-[220px] rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-[11px] leading-relaxed font-normal text-[#6B7280] shadow-[0_8px_24px_rgba(15,23,42,0.12)] sm:w-[260px]">
                      {appointment.unavailableReason}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>
            {showBookingId ? (
              <p className="mt-1 text-xs font-semibold text-[#111827]">
                Booking ID:- {bookingId}
              </p>
            ) : null}
          </div>
          <ProviderVisitBadge visitType={appointment.visitType} />
        </div>
      </button>
      {index < total - 1 ? (
        <div className="ml-[88px] border-b border-[#F1F4F9]" />
      ) : null}
    </li>
  );
}

function TimelineGroupedList({ groups, showInfo = false, onOpen }) {
  if (groups.length === 0) return null;

  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.dateKey}>
          <h2 className="mb-2 px-1 text-[11px] font-semibold tracking-[0.08em] text-[#9CA3AF] uppercase">
            {group.label}
          </h2>
          <div className="rounded-2xl border border-[#EEF2F7] bg-white px-3 shadow-[0_2px_12px_rgba(15,23,42,0.04)] sm:px-4">
            <ul>
              {group.items.map((apt, index) => (
                <TimelineAppointmentRow
                  key={apt.id}
                  appointment={apt}
                  index={index}
                  total={group.items.length}
                  showInfo={showInfo}
                  onOpen={onOpen}
                />
              ))}
            </ul>
          </div>
        </section>
      ))}
    </div>
  );
}

export function ProviderAppointmentsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const { providerAppointments, updateStatus } = useAppointmentStore();

  const [tab, setTab] = useState(
    TABS.some((item) => item.id === tabParam) ? tabParam : "upcoming",
  );
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    if (TABS.some((item) => item.id === tabParam)) {
      setTab(tabParam);
    }
  }, [tabParam]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return providerAppointments.filter((apt) => {
      if (!matchesTab(apt, tab)) return false;
      if (!query) return true;
      return (
        apt.userName.toLowerCase().includes(query) ||
        apt.serviceName.toLowerCase().includes(query) ||
        (apt.userPhone || "").toLowerCase().includes(query) ||
        (apt.bookingCode || "").toLowerCase().includes(query)
      );
    });
  }, [providerAppointments, tab, search]);

  const grouped = useMemo(() => groupAppointmentsByDate(filtered), [filtered]);

  const handleConfirmAccept = () => {
    if (!acceptTarget) return;
    updateStatus(acceptTarget.id, APPOINTMENT_STATUS.CONFIRMED);
    toast.success("Appointment accepted");
    setAcceptTarget(null);
  };

  const handleConfirmReject = () => {
    if (!rejectTarget) return;
    updateStatus(rejectTarget.id, APPOINTMENT_STATUS.REJECTED);
    toast.success("Appointment rejected");
    setRejectTarget(null);
  };

  const openDetail = (appointment) => {
    router.push(providerAppointmentDetailRoute(appointment.id));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-30 shrink-0 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className={PROVIDER_MOBILE_HEADER}>
          <Link
            href={ROUTES.PROVIDER_HOME}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <img
              src={PROVIDER_ICONS.arrowLeft}
              alt=""
              className="size-5 object-contain"
              draggable={false}
            />
          </Link>
          <h1 className="min-w-0 flex-1 truncate text-lg font-bold text-[#111827]">
            Appointments
          </h1>
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Search appointments"
          >
            {searchOpen ? (
              <img
                src={PROVIDER_ICONS.closeCircle}
                alt=""
                className="size-5 object-contain"
                draggable={false}
              />
            ) : (
              <img
                src={PROVIDER_ICONS.search}
                alt=""
                className="size-5 object-contain"
                draggable={false}
              />
            )}
          </button>
          <Link
            href={ROUTES.PROVIDER_APPOINTMENTS}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F1FF] transition-colors hover:bg-[#D6E6FF]"
            aria-label="Calendar"
          >
            <img
              src={PROVIDER_ICONS.calendarBlue}
              alt=""
              className="size-5 object-contain"
              draggable={false}
            />
          </Link>
        </div>

        {searchOpen && (
          <div className={cn(PROVIDER_PAGE_SHELL, "pb-3")}>
            <div className="relative">
              <img
                src={PROVIDER_ICONS.search}
                alt=""
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 object-contain opacity-50"
                draggable={false}
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search patient or service..."
                className="focus:border-primary focus:ring-primary/15 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white pr-3 pl-9 text-sm outline-none focus:ring-2"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className={cn(PROVIDER_PAGE_SHELL, "pt-4 pb-6")}>
          <div className="-mx-1 mb-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-1 pb-1 [&::-webkit-scrollbar]:hidden">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-4 text-sm font-semibold transition-colors",
                    active
                      ? TAB_ACTIVE_CLASS[item.id]
                      : "border-[#E5E7EB] bg-white text-[#6B7280]",
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {tab === "pending" ? (
            <div className={PROVIDER_DESKTOP_GRID}>
              {filtered.map((apt) => (
                <ProviderAppointmentRequestCard
                  key={apt.id}
                  appointment={apt}
                  onAccept={setAcceptTarget}
                  onReject={setRejectTarget}
                />
              ))}
            </div>
          ) : (
            <TimelineGroupedList
              groups={grouped}
              showInfo={tab === "cancelled"}
              onOpen={openDetail}
            />
          )}

          {filtered.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#D8E0EF] bg-white/70 px-4 py-12 text-center">
              <p className="text-muted-foreground text-sm">
                No {tab === "upcoming" ? "upcoming" : tab} appointments
              </p>
            </div>
          )}
        </div>
      </main>

      <AcceptRequestModal
        open={Boolean(acceptTarget)}
        appointment={acceptTarget}
        onClose={() => setAcceptTarget(null)}
        onConfirm={handleConfirmAccept}
      />
      <RejectRequestModal
        open={Boolean(rejectTarget)}
        appointment={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onConfirm={handleConfirmReject}
      />
    </div>
  );
}
