"use client";

import { MessageSquare, User } from "lucide-react";

import { cn } from "@/lib/utils";

const BLOCK_EFFECTS = [
  {
    icon: MessageSquare,
    label: "No more messages or calls",
  },
  {
    icon: User,
    label: "Their profile will be hidden",
  },
];

export function BlockDoctorModal({ open, onClose, doctorName, onConfirm, className }) {
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-5",
        className,
      )}
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/45 backdrop-blur-[3px] md:bg-black/40 md:backdrop-blur-[4px]"
        onClick={onClose}
        aria-label="Close block dialog"
      />

      {/* Mobile — unchanged structure */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-doctor-title"
        className="bg-background relative w-full max-w-[22rem] rounded-2xl px-5 pt-6 pb-5 shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:hidden"
      >
        <h2
          id="block-doctor-title"
          className="text-foreground text-center text-lg leading-snug font-bold"
        >
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
            className="bg-muted hover:bg-muted h-11 rounded-xl text-sm font-semibold text-[#374151] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="gradient-brand h-11 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-95"
          >
            Block
          </button>
        </div>
      </div>

      {/* Web — reference layout */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="block-doctor-title-web"
        className="relative hidden w-full max-w-[28rem] overflow-hidden rounded-[1.5rem] bg-white px-7 pt-7 pb-7 text-center shadow-[0_20px_60px_rgba(15,23,42,0.18)] md:block"
      >
        <h2
          id="block-doctor-title-web"
          className="text-[1.25rem] leading-snug font-bold text-[#111827]"
        >
          Block {doctorName}?
        </h2>

        <div className="mt-5 border-t border-[#E6EAF2]" />

        <p className="mt-5 text-[15px] leading-relaxed text-[#6B7280]">
          You won&apos;t be able to see their profile or interact with them.
        </p>

        <ul className="mt-6 space-y-4 text-left">
          <li className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[0.75rem] bg-[#EFF6FF]">
              <img
                src="/icons/messages.svg"
                alt=""
                className="size-5 object-contain"
                draggable={false}
                aria-hidden
              />
            </span>
            <span className="text-[15px] font-medium text-[#111827]">
              No more messages or calls
            </span>
          </li>
          <li className="flex items-center gap-3.5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-[0.75rem] bg-[#EFF6FF]">
              <img
                src="/icons/User.svg"
                alt=""
                className="size-5 object-contain"
                draggable={false}
                aria-hidden
              />
            </span>
            <span className="text-[15px] font-medium text-[#111827]">
              Their profile will be hidden
            </span>
          </li>
        </ul>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl bg-[#F3F4F6] text-base font-semibold text-[#111827] transition-colors hover:bg-[#E5E7EB]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 rounded-xl bg-gradient-to-b from-[#4B8DF8] to-[#1865EA] text-base font-semibold text-white transition-opacity hover:opacity-95"
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
