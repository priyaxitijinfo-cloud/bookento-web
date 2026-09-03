"use client";

import { formatDate } from "@/utils/format.utils";
import { getMinutesUntilAppointment } from "@/lib/chats/chat.utils";

function CallRestrictionIllustration() {
  return (
    <div className="mx-auto flex h-[9.375rem] w-[9.625rem] items-center justify-center">
      <img
        src="/icons/call-restriction-illustration.svg"
        alt=""
        className="h-full w-full object-contain"
        aria-hidden
        draggable={false}
      />
    </div>
  );
}

export function CallRestrictionModal({
  open,
  onClose,
  providerName,
  scheduledDate,
  scheduledTime,
}) {
  if (!open) return null;

  const dateLabel = scheduledDate ? formatDate(scheduledDate, "EEE, MMM d") : null;
  const schedulePart =
    dateLabel && scheduledTime
      ? `${dateLabel} • ${scheduledTime}`
      : scheduledTime || "your scheduled time";

  const minutesUntil = getMinutesUntilAppointment(scheduledDate, scheduledTime);
  const bannerText =
    minutesUntil != null && minutesUntil > 0
      ? `Your appointment starts in ${minutesUntil} minutes. You can call after that.`
      : "Your appointment starts in 10 minutes. You can call after that.";

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
        className="relative w-full max-w-md rounded-[1.75rem] bg-white px-6 pt-8 pb-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <CallRestrictionIllustration />

        <h2
          id="call-restriction-title"
          className="text-foreground mt-6 text-center text-xl font-bold"
        >
          Call at Appointment Time
        </h2>
        <p className="text-muted-foreground mt-3 px-1 text-center text-sm leading-relaxed">
          You can only call {providerName} at your scheduled appointment time is{" "}
          {schedulePart}
        </p>

        <div className="mt-5 border-t border-[#EEF2F7] pt-5">
          <div className="flex items-start gap-3">
            <img
              src="/icons/info.svg"
              alt=""
              className="size-6 shrink-0"
              aria-hidden
              draggable={false}
            />
            <p className="text-muted-foreground pt-0.5 text-sm leading-relaxed">
              {bannerText}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="gradient-brand mt-6 h-12 w-full rounded-xl text-base font-medium text-white transition-opacity hover:opacity-95 md:font-semibold"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
