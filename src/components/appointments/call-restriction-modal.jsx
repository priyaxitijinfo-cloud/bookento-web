"use client";

import { PhoneOff } from "lucide-react";

import { formatDate } from "@/utils/format.utils";

export function CallRestrictionModal({ open, onClose, providerName, scheduledDate, scheduledTime }) {
  if (!open) return null;

  const dateLabel = formatDate(scheduledDate, "EEE, MMM d");

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close call restriction dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="call-restriction-title"
        className="relative w-full max-w-md rounded-[1.75rem] bg-background px-6 pb-6 pt-8 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <div className="relative mx-auto flex size-28 items-center justify-center">
          <span className="absolute left-2 top-3 text-lg font-light text-[#22C55E]">+</span>
          <span className="absolute right-2 top-4 size-2 rounded-full bg-[#22C55E]/30" />
          <span className="absolute bottom-3 left-3 size-2 rounded-full bg-[#22C55E]/30" />
          <span className="absolute bottom-2 right-2 text-lg font-light text-[#22C55E]">+</span>
          <div className="flex size-24 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
            <PhoneOff className="size-10" strokeWidth={2} />
          </div>
        </div>

        <h2 id="call-restriction-title" className="text-foreground mt-5 text-center text-xl font-bold">
          Call at Appointment Time
        </h2>
        <p className="text-muted-foreground mt-3 text-center text-sm leading-relaxed">
          You can only call {providerName} at your scheduled appointment time on {dateLabel} · {scheduledTime}.
        </p>

        <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3 text-center text-sm text-primary">
          Your appointment starts in 10 minutes. You can call after that.
        </div>

        <button
          type="button"
          onClick={onClose}
          className="gradient-brand mt-5 h-12 w-full rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
