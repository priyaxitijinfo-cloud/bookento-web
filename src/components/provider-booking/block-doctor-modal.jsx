"use client";

import { MessageSquare, UserX } from "lucide-react";

import { cn } from "@/lib/utils";

const BLOCK_EFFECTS = [
  {
    icon: MessageSquare,
    label: "No more messages or calls",
  },
  {
    icon: UserX,
    label: "Their profile will be hidden",
  },
];

export function BlockDoctorModal({ open, onClose, doctorName, onConfirm, className }) {
  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-[70] flex items-center justify-center p-5", className)}>
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px]"
        onClick={onClose}
        aria-label="Close block dialog"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-doctor-title"
        className="relative w-full max-w-[22rem] rounded-2xl bg-background px-5 pb-5 pt-6 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      >
        <h2 id="block-doctor-title" className="text-foreground text-center text-lg font-bold leading-snug">
          Block {doctorName}?
        </h2>
        <p className="text-muted-foreground mt-2 text-center text-sm leading-relaxed">
          You won&apos;t be able to see their profile or interact with them.
        </p>

        <ul className="mt-5 space-y-3">
          {BLOCK_EFFECTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-3">
              <span className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <Icon className="size-[1.125rem]" strokeWidth={2.1} />
              </span>
              <span className="text-foreground text-sm font-medium">{label}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-11 rounded-xl bg-muted text-sm font-semibold text-[#374151] transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="gradient-brand h-11 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-95"
          >
            Block
          </button>
        </div>
      </div>
    </div>
  );
}

export function getDoctorDisplayName(businessName) {
  if (businessName.startsWith("Dr.")) return businessName;
  return `Dr. ${businessName.replace(/^Dr\.\s*/i, "")}`;
}
