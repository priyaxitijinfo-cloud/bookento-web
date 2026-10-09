"use client";

import { format, isValid, parseISO } from "date-fns";

import { ProviderVisitBadge } from "@/features/provider/components/provider-visit-badge";
import { cn } from "@/lib/utils";
import { formatCurrency, getInitials } from "@/utils/format.utils";

function formatRequestDateTime(scheduledDate, scheduledTime) {
  const parsed =
    typeof scheduledDate === "string" ? parseISO(scheduledDate) : scheduledDate;
  if (!isValid(parsed)) return scheduledTime || "";
  return `${format(parsed, "EEEE")} · ${scheduledTime}`;
}

export function ProviderAppointmentRequestCard({
  appointment,
  onAccept,
  onReject,
  className,
}) {
  if (!appointment) return null;

  return (
    <article
      className={cn(
        "rounded-2xl border border-[#EEF2F7] bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold text-[#1865EA]">
          {formatRequestDateTime(appointment.scheduledDate, appointment.scheduledTime)}
        </p>
        <ProviderVisitBadge visitType={appointment.visitType} />
      </div>

      <div className="mt-3 border-t border-[#F1F4F9]" />

      <div className="mt-3.5 flex items-start gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#FFE8D6] text-sm font-semibold text-[#E07A3D]"
          aria-hidden
        >
          {getInitials(appointment.userName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[15px] font-semibold text-[#111827]">
                {appointment.userName}
              </p>
              <p className="text-muted-foreground mt-0.5 truncate text-sm">
                {appointment.serviceName}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[15px] font-bold text-[#1865EA]">
                {formatCurrency(appointment.amount)}
              </p>
              {appointment.userPhone && (
                <p className="text-muted-foreground mt-0.5 text-xs whitespace-nowrap">
                  {appointment.userPhone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onReject?.(appointment)}
          className="h-11 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E8ECF1]"
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => onAccept?.(appointment)}
          className="gradient-brand h-11 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
        >
          Accept
        </button>
      </div>
    </article>
  );
}
