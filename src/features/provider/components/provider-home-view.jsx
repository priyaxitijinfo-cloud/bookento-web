"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, Eye, HandCoins } from "lucide-react";
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
import { ROUTES } from "@/constants/routes.constants";
import { APPOINTMENT_STATUS } from "@/constants/status.constants";
import { providerDashboard } from "@/mock/dashboard";
import { currentProvider } from "@/mock/providers";
import { useAppointmentStore } from "@/store";
import { cn } from "@/lib/utils";
import { getLocalDateKey } from "@/utils/format.utils";

function SectionHeader({ title, href, count }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="bg-primary h-4 w-1 shrink-0 rounded-full" aria-hidden />
        <h2 className="truncate text-base font-bold text-[#1F2937]">
          {title}
          {typeof count === "number" ? ` (${count})` : ""}
        </h2>
      </div>
      <Link
        href={href}
        className="text-primary shrink-0 text-sm font-semibold hover:underline"
      >
        See all &gt;
      </Link>
    </div>
  );
}

function StatCard({ value, label, trend, icon: Icon, tone }) {
  const tones = {
    earnings: {
      card: "bg-[#F0EBFF]",
      icon: "bg-[#7C5CFC] text-white",
      badge: "bg-white/90 text-[#7C5CFC]",
    },
    patients: {
      card: "bg-[#FDE8F0]",
      icon: "bg-[#F06292] text-white",
      badge: "bg-white/90 text-[#EC407A]",
    },
  };
  const styles = tones[tone];

  return (
    <div className={cn("relative overflow-hidden rounded-2xl p-3.5", styles.card)}>
      <span
        className={cn(
          "absolute top-2.5 right-2.5 rounded-full px-2 py-0.5 text-[10px] font-semibold",
          styles.badge,
        )}
      >
        ↑ {trend}%
      </span>
      <div
        className={cn(
          "mb-3 flex size-9 items-center justify-center rounded-xl",
          styles.icon,
        )}
      >
        <Icon className="size-4" />
      </div>
      <p className="text-xl font-bold tracking-tight text-[#111827]">{value}</p>
      <p className="text-muted-foreground mt-0.5 text-xs">{label}</p>
    </div>
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

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className="mx-auto w-full max-w-3xl px-4 pt-4 pb-6 lg:px-6 lg:pt-6">
          <header className="mb-5 flex items-center justify-between gap-3">
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
              className="bg-card flex size-11 shrink-0 items-center justify-center rounded-full shadow-[0_2px_10px_rgba(15,23,42,0.08)] transition-colors hover:bg-white"
              aria-label="Notifications"
            >
              <Bell className="size-5 text-[#111827]" />
            </Link>
          </header>

          <div className="mb-6 grid grid-cols-2 gap-3">
            <StatCard
              value={stats.todayEarningsLabel || "24.5K"}
              label="Today's Earnings"
              trend={stats.earningsTrend}
              icon={HandCoins}
              tone="earnings"
            />
            <StatCard
              value={String(stats.todayPatients ?? 850)}
              label="Today's Patients"
              trend={stats.patientsTrend ?? 12.5}
              icon={Eye}
              tone="patients"
            />
          </div>

          <section className="mb-6">
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

          <section>
            <SectionHeader
              title="Today's Schedule"
              href={ROUTES.PROVIDER_APPOINTMENTS}
            />
            <div className="rounded-2xl border border-[#EEF2F7] bg-white px-4 py-2 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
              {schedule.length === 0 ? (
                <p className="text-muted-foreground py-8 text-center text-sm">
                  No appointments scheduled for today
                </p>
              ) : (
                <ul>
                  {schedule.map((apt, index) => (
                    <li key={apt.id} className="relative flex gap-3 py-3.5">
                      <div className="w-[72px] shrink-0 pt-0.5">
                        <p className="text-sm font-semibold text-[#111827]">
                          {apt.scheduledTime}
                        </p>
                      </div>

                      <div className="relative flex w-4 shrink-0 flex-col items-center">
                        {index < schedule.length - 1 && (
                          <span className="absolute top-3 bottom-[-14px] w-px bg-[#E5E7EB]" />
                        )}
                        <span
                          className={cn(
                            "relative z-10 mt-1.5 size-2.5 rounded-full",
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
              )}
            </div>
          </section>
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
