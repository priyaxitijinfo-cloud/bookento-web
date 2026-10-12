"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { ProviderAppointmentRequestCard } from "@/features/provider/components/provider-appointment-request-card";
import {
  AcceptRequestModal,
  RejectRequestModal,
} from "@/features/provider/components/provider-request-modals";
import {
  getScheduleDotClass,
  ProviderVisitBadge,
} from "@/features/provider/components/provider-visit-badge";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import { PROVIDER_PAGE_SHELL } from "@/lib/layout/page-layout.constants";
import { ROUTES } from "@/constants/routes.constants";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { providerDashboard } from "@/mock/dashboard";
import { currentProvider } from "@/mock/providers";
import { useAppointmentStore } from "@/store";
import { cn } from "@/lib/utils";
import { formatCurrency, getLocalDateKey } from "@/utils/format.utils";

function SectionHeader({ title, href, count }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-4 w-1 shrink-0 rounded-full bg-[#1865EA] lg:hidden"
          aria-hidden
        />
        <h2 className="truncate text-base font-bold text-[#1F2937]">
          {title}
          {typeof count === "number" ? ` (${count})` : ""}
        </h2>
      </div>
      <Link
        href={href}
        className="shrink-0 text-sm font-semibold text-[#1865EA] hover:underline"
      >
        See all &gt;
      </Link>
    </div>
  );
}

function TrendUpIcon({ className }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className={className}>
      <path
        d="M6 2.25L9.75 6M6 2.25L2.25 6M6 2.25V9.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrendBadge({ trend, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
        className,
      )}
    >
      <TrendUpIcon className="size-2.5 shrink-0" />
      {trend}%
    </span>
  );
}

function StatCard({ value, label, trend, iconSrc, tone }) {
  const tones = {
    earnings: {
      card: "bg-[#F0EBFF]",
      icon: "bg-[#7C5CFC]",
      badge: "bg-white/90 text-[#7C5CFC]",
    },
    patients: {
      card: "bg-[#FDE8F0]",
      icon: "bg-[#F06292]",
      badge: "bg-white/90 text-[#EC407A]",
    },
  };
  const styles = tones[tone];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-3.5", styles.card)}>
      <TrendBadge
        trend={trend}
        className={cn("absolute top-2.5 right-2.5", styles.badge)}
      />
      <div
        className={cn(
          "mb-3 flex size-9 items-center justify-center rounded-xl",
          styles.icon,
        )}
      >
        <img
          src={iconSrc}
          alt=""
          className="size-4 brightness-0 invert"
          draggable={false}
        />
      </div>
      <p className="text-xl font-bold tracking-tight text-[#111827]">{value}</p>
      <p className="text-muted-foreground mt-0.5 text-xs">{label}</p>
    </div>
  );
}

/** Desktop KPI card — Rizz layout, Bookento colors */
function DesktopKpiCard({ value, label, trend, iconSrc, tone }) {
  const tones = {
    earnings: {
      card: "bg-white",
      iconWrap: "bg-[#EDE7FF]",
      iconBg: "bg-[#7C5CFC]",
      badge: "bg-[#EDE7FF] text-[#7C5CFC]",
    },
    patients: {
      card: "bg-white",
      iconWrap: "bg-[#FFE4EC]",
      iconBg: "bg-[#F06292]",
      badge: "bg-[#FFE4EC] text-[#EC407A]",
    },
  };
  const styles = tones[tone];

  return (
    <article
      className={cn(
        "rounded-2xl border border-[#EEF2F7] p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
        styles.card,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-2xl",
            styles.iconWrap,
          )}
        >
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              styles.iconBg,
            )}
          >
            <img
              src={iconSrc}
              alt=""
              className="size-4 brightness-0 invert"
              draggable={false}
            />
          </span>
        </div>
        <TrendBadge
          trend={trend}
          className={cn("px-2.5 py-1 text-[11px]", styles.badge)}
        />
      </div>

      <p className="mt-5 text-[1.75rem] font-bold tracking-tight text-[#0F172A]">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-[#64748B]">{label}</p>
    </article>
  );
}

function ScheduleList({ schedule }) {
  if (schedule.length === 0) {
    return (
      <p className="text-muted-foreground py-8 text-center text-sm">
        No appointments scheduled for today
      </p>
    );
  }

  return (
    <ul className="relative">
      {schedule.length > 1 ? (
        <span
          aria-hidden
          className="pointer-events-none absolute top-5 bottom-5 left-[92px] z-0 w-px bg-[#E5E7EB]"
        />
      ) : null}
      {schedule.map((apt, index) => (
        <li key={apt.id} className="relative flex gap-3 py-3.5">
          <div className="w-[72px] shrink-0 pt-0.5">
            <p className="text-sm font-semibold text-[#111827]">{apt.scheduledTime}</p>
          </div>

          <div className="relative z-10 flex w-4 shrink-0 flex-col items-center">
            <span
              className={cn(
                "mt-1.5 size-2.5 rounded-full",
                getScheduleDotClass(apt.visitType, index),
              )}
            />
          </div>

          <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#111827]">
                {apt.userName}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-xs">
                {apt.serviceName}
              </p>
            </div>
            <ProviderVisitBadge visitType={apt.visitType} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ProviderHomeView() {
  const { providerAppointments, updateStatus } = useAppointmentStore();
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  const todayKey = getLocalDateKey();
  const stats = providerDashboard;

  const pending = useMemo(
    () =>
      providerAppointments
        .filter((apt) => apt.status === APPOINTMENT_STATUS.PENDING)
        .slice(0, 2),
    [providerAppointments],
  );

  const pendingCount = useMemo(
    () =>
      providerAppointments.filter((apt) => apt.status === APPOINTMENT_STATUS.PENDING)
        .length,
    [providerAppointments],
  );

  const schedule = useMemo(
    () =>
      providerAppointments
        .filter(
          (apt) =>
            apt.scheduledDate === todayKey &&
            (apt.status === APPOINTMENT_STATUS.UPCOMING ||
              apt.status === APPOINTMENT_STATUS.CONFIRMED),
        )
        .slice(0, 5),
    [providerAppointments, todayKey],
  );

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

  const greetingName =
    currentProvider.businessName?.split(" ")[0] || currentProvider.businessName;

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className={cn(PROVIDER_PAGE_SHELL, "pt-4 pb-6 lg:pt-6 lg:pb-10")}>
          {/* ── Mobile header (your main UI) ── */}
          <header className="mb-5 flex items-center justify-between gap-3 lg:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#E8F1FF] shadow-sm ring-2 ring-white">
                {currentProvider.avatar ? (
                  <Image
                    src={currentProvider.avatar}
                    alt={currentProvider.businessName}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-bold text-[#111827]">
                  {currentProvider.businessName}
                </h1>
                <p className="text-muted-foreground truncate text-sm">
                  {currentProvider.specialty}
                </p>
              </div>
            </div>

            <Link
              href={ROUTES.PROVIDER_NOTIFICATIONS}
              className="relative flex size-10 shrink-0 items-center justify-center text-[#111827] transition-opacity hover:opacity-80"
              aria-label="Notifications"
            >
              <img
                src={PROVIDER_ICONS.bell}
                alt=""
                className="size-6 object-contain"
                draggable={false}
              />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-[#EF4444] ring-2 ring-[#F4F7FF]" />
            </Link>
          </header>

          {/* ── Desktop header (Rizz-style shell, Bookento UI) ── */}
          <header className="mb-6 hidden items-center justify-between gap-4 lg:flex">
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-[#0F172A]">
                Good Morning, {greetingName}!
              </h1>
              <p className="mt-0.5 text-sm text-[#64748B]">
                {currentProvider.specialty} · Here&apos;s your clinic overview today
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <div className="relative hidden xl:block">
                <img
                  src={PROVIDER_ICONS.search}
                  alt=""
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 opacity-50"
                  draggable={false}
                />
                <input
                  type="search"
                  placeholder="Search here..."
                  className="h-11 w-72 rounded-full border border-[#E5E7EB] bg-white pr-4 pl-10 text-sm text-[#0F172A] outline-none placeholder:text-[#94A3B8] focus:border-[#1865EA] focus:ring-2 focus:ring-[#1865EA]/15 xl:w-80"
                />
              </div>
              <Link
                href={ROUTES.PROVIDER_NOTIFICATIONS}
                className="relative flex size-11 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm transition-colors hover:bg-[#F8FAFF]"
                aria-label="Notifications"
              >
                <img
                  src={PROVIDER_ICONS.bell}
                  alt=""
                  className="size-5 object-contain"
                  draggable={false}
                />
                <span className="absolute top-2.5 right-2.5 size-2 rounded-full bg-[#EF4444] ring-2 ring-white" />
              </Link>
              <div className="relative size-11 shrink-0 overflow-hidden rounded-full bg-[#E8F1FF] ring-2 ring-white">
                {currentProvider.avatar ? (
                  <Image
                    src={currentProvider.avatar}
                    alt={currentProvider.businessName}
                    fill
                    className="object-cover"
                    sizes="44px"
                    unoptimized
                  />
                ) : null}
              </div>
            </div>
          </header>

          {/* ── Mobile stats (your main UI) ── */}
          <div className="mb-6 grid grid-cols-2 gap-3 lg:hidden">
            <StatCard
              value={stats.todayEarningsLabel || "24.5K"}
              label="Today's Earnings"
              trend={stats.earningsTrend}
              iconSrc={PROVIDER_ICONS.handMoney}
              tone="earnings"
            />
            <StatCard
              value={String(stats.todayPatients ?? 850)}
              label="Today's Patients"
              trend={stats.patientsTrend ?? 12.5}
              iconSrc={PROVIDER_ICONS.eye}
              tone="patients"
            />
          </div>

          {/* ── Desktop KPI cards ── */}
          <div className="mb-6 hidden gap-5 lg:grid lg:grid-cols-2">
            <DesktopKpiCard
              value={
                stats.todayEarningsLabel
                  ? `₹${stats.todayEarningsLabel}`
                  : formatCurrency(stats.todayEarnings)
              }
              label="Today's Earnings"
              trend={stats.earningsTrend}
              iconSrc={PROVIDER_ICONS.handMoney}
              tone="earnings"
            />
            <DesktopKpiCard
              value={String(stats.todayPatients ?? 850)}
              label="Today's Patients"
              trend={stats.patientsTrend ?? 12.5}
              iconSrc={PROVIDER_ICONS.eye}
              tone="patients"
            />
          </div>

          {/* ── Pending + Schedule ── */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <section className="min-w-0">
              <SectionHeader
                title="Pending Requests"
                count={pendingCount}
                href={`${ROUTES.PROVIDER_APPOINTMENTS}?tab=pending`}
              />
              <div className="space-y-3">
                {pending.map((apt) => (
                  <ProviderAppointmentRequestCard
                    key={apt.id}
                    appointment={apt}
                    onAccept={setAcceptTarget}
                    onReject={setRejectTarget}
                  />
                ))}
                {pending.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-[#D8E0EF] bg-white/70 px-4 py-8 text-center">
                    <p className="text-muted-foreground text-sm">No pending requests</p>
                  </div>
                )}
              </div>
            </section>

            <section className="min-w-0">
              <SectionHeader
                title="Today's Schedule"
                href={ROUTES.PROVIDER_APPOINTMENTS}
              />
              <div className="rounded-2xl border border-[#EEF2F7] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
                <ScheduleList schedule={schedule} />
              </div>
            </section>
          </div>
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
    </>
  );
}
