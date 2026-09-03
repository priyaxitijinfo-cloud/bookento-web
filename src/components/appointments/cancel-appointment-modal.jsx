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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
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
        className="bg-background relative w-full max-w-lg rounded-[1.75rem] px-5 pt-6 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)] max-md:bg-white sm:rounded-[1.75rem] sm:px-6"
      >
        <h2
          id="cancel-appointment-title"
          className="md:text-foreground text-center text-xl font-semibold text-[#111827] md:font-bold"
        >
          Cancel Appointment
        </h2>
        <div className="-mx-5 mt-4 h-px bg-[#E5E7EB] sm:-mx-6 md:hidden" />

        <div className="mt-5">
          <label
            htmlFor="cancel-reason"
            className="md:text-foreground mb-2 block text-sm font-semibold text-[#111827]"
          >
            Reason
          </label>
          <div className="relative">
            <textarea
              id="cancel-reason"
              value={reason}
              onChange={(event) => setReason(event.target.value.slice(0, 500))}
              placeholder="ABC..."
              rows={5}
              className="bg-background text-foreground focus:border-primary focus:ring-primary/15 md:border-border/70 md:placeholder:text-muted-foreground w-full resize-none rounded-2xl border border-[#E5E7EB] px-4 py-3 text-sm outline-none placeholder:text-[#94A3B8] focus:ring-2"
            />
            <span className="md:text-muted-foreground absolute right-3 bottom-3 text-xs text-[#94A3B8]">
              {reason.length}/500
            </span>
          </div>
        </div>

        <div className="text-primary mt-4 flex items-start gap-2.5 rounded-xl bg-[#EFF6FF] px-3 py-3 text-sm max-md:text-[#1E3A8A]">
          <img
            src="/icons/info.svg"
            alt=""
            className="mt-0.5 size-5 shrink-0 md:hidden"
            aria-hidden
            draggable={false}
          />
          <Info className="mt-0.5 hidden size-4 shrink-0 md:block" />
          <p>Your booking will be updated with the new date &amp; time.</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="md:bg-muted md:hover:bg-muted h-12 rounded-xl bg-[#F3F4F6] text-sm font-medium text-[#111827] transition-colors hover:bg-[#F3F4F6] disabled:opacity-60 md:font-semibold md:text-[#374151]"
          >
            Keep
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={cn(
              "gradient-brand h-12 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95 md:font-semibold",
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
