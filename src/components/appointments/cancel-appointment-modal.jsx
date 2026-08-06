"use client";

import { useState } from "react";
import { Info } from "lucide-react";

import { cn } from "@/lib/utils";

export function CancelAppointmentModal({ open, onClose, onConfirm, loading = false }) {
  const [reason, setReason] = useState("");

  if (!open) return null;

  const handleConfirm = () => {
    onConfirm?.(reason.trim());
  };

  const handleClose = () => {
    setReason("");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={handleClose}
        aria-label="Close cancel dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-appointment-title"
        className="relative w-full max-w-lg rounded-t-[1.75rem] bg-background px-5 pb-6 pt-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:rounded-[1.75rem] sm:px-6"
      >
        <h2 id="cancel-appointment-title" className="text-foreground text-center text-xl font-bold">
          Cancel Appointment
        </h2>

        <div className="mt-5">
          <label htmlFor="cancel-reason" className="text-foreground mb-2 block text-sm font-semibold">
            Reason
          </label>
          <div className="relative">
            <textarea
              id="cancel-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value.slice(0, 500))}
              placeholder="ABC..."
              rows={5}
              className="border-border/70 text-foreground placeholder:text-muted-foreground w-full resize-none rounded-2xl border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
            <span className="text-muted-foreground absolute bottom-3 right-3 text-xs">
              {reason.length}/500
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 rounded-xl bg-[#EFF6FF] px-3 py-3 text-sm text-primary">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>Your booking will be updated with the new date &amp; time.</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="h-12 rounded-xl bg-muted text-sm font-semibold text-[#374151] transition-colors hover:bg-muted disabled:opacity-60"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "gradient-brand h-12 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95",
              loading && "opacity-70",
            )}
          >
            {loading ? "Cancelling..." : "Confirm Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
