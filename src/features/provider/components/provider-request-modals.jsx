"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format, isToday, isValid, parseISO } from "date-fns";
import { CalendarDays, User } from "lucide-react";

import { cn } from "@/lib/utils";

function formatModalAppointmentTime(scheduledDate, scheduledTime) {
  const parsed =
    typeof scheduledDate === "string" ? parseISO(scheduledDate) : scheduledDate;
  if (!isValid(parsed)) return scheduledTime || "";
  if (isToday(parsed)) return `Today ${scheduledTime}`;
  return `${format(parsed, "dd MMM")} ${scheduledTime}`;
}

function ModalInfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E8F1FF] text-[#1865EA]">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="truncate text-sm font-semibold text-[#111827]">{value}</p>
      </div>
    </div>
  );
}

function RequestModalShell({
  open,
  onClose,
  title,
  description,
  appointment,
  children,
  cancelLabel = "Cancel",
  confirmLabel,
  onConfirm,
  confirmDisabled = false,
  loading = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || !mounted || !appointment) return null;

  const modal = (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="provider-request-modal-title"
        className="relative w-full max-w-[380px] rounded-[1.5rem] bg-white px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <h2
          id="provider-request-modal-title"
          className="text-center text-xl font-bold text-[#111827]"
        >
          {title}
        </h2>
        <p className="text-muted-foreground mx-auto mt-2 max-w-[300px] text-center text-sm leading-relaxed">
          {description}
        </p>

        <div className="mt-5 space-y-4">
          <ModalInfoRow icon={User} label="Patient Name" value={appointment.userName} />
          <ModalInfoRow
            icon={CalendarDays}
            label="Appointment Time"
            value={formatModalAppointmentTime(
              appointment.scheduledDate,
              appointment.scheduledTime,
            )}
          />
        </div>

        {children}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-12 rounded-xl bg-[#F2F4F7] text-sm font-semibold text-[#374151] transition-colors hover:bg-[#E8ECF1] disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || confirmDisabled}
            className={cn(
              "gradient-brand h-12 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-60",
            )}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export function AcceptRequestModal({
  open,
  appointment,
  onClose,
  onConfirm,
  loading = false,
}) {
  return (
    <RequestModalShell
      open={open}
      onClose={onClose}
      appointment={appointment}
      title="Accept Request?"
      description="Are you sure you want to accept this appointment request?"
      confirmLabel="Accept"
      onConfirm={onConfirm}
      loading={loading}
    />
  );
}

export function RejectRequestModal({
  open,
  appointment,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  return (
    <RequestModalShell
      open={open}
      onClose={onClose}
      appointment={appointment}
      title="Reject Request?"
      description="Please provide a reason for rejecting this appointment request."
      confirmLabel="Reject"
      onConfirm={() => onConfirm?.(reason.trim())}
      confirmDisabled={!reason.trim()}
      loading={loading}
    >
      <div className="mt-5">
        <label
          htmlFor="reject-reason"
          className="mb-2 block text-sm font-semibold text-[#111827]"
        >
          Reason for rejection
        </label>
        <textarea
          id="reject-reason"
          value={reason}
          onChange={(event) => setReason(event.target.value.slice(0, 500))}
          placeholder="Enter reason for rejection..."
          rows={4}
          className="text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/15 w-full resize-none rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:ring-2"
        />
      </div>
    </RequestModalShell>
  );
}
