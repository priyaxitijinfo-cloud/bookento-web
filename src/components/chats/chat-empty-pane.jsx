"use client";

import { cn } from "@/lib/utils";

export function ChatEmptyPane({ className }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[24rem] flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center",
        className,
      )}
    >
      <div className="mb-2 size-40 opacity-90 md:size-48">
        <svg
          viewBox="0 0 200 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full"
          aria-hidden
        >
          <ellipse cx="100" cy="148" rx="70" ry="8" fill="#E2E8F0" opacity="0.7" />
          <path d="M148 118h28l-3 22a8 8 0 0 1-8 7h-6a8 8 0 0 1-8-7l-3-22z" fill="#FDBA74" />
          <rect x="145" y="112" width="34" height="8" rx="2" fill="#FB923C" />
          <path d="M162 112c0-18 10-28 10-40" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
          <path d="M162 100c-10-4-16-14-14-24" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="174" cy="72" rx="10" ry="14" fill="#4ADE80" opacity="0.9" />
          <ellipse cx="152" cy="78" rx="9" ry="12" fill="#22C55E" opacity="0.85" />
          <rect x="128" y="48" width="36" height="28" rx="12" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="138" cy="62" r="2.5" fill="#94A3B8" />
          <circle cx="146" cy="62" r="2.5" fill="#94A3B8" />
          <circle cx="154" cy="62" r="2.5" fill="#94A3B8" />
          <path
            d="M36 28h88a20 20 0 0 1 20 20v36a20 20 0 0 1-20 20H72l-18 16v-16H36A20 20 0 0 1 16 84V48A20 20 0 0 1 36 28z"
            fill="#1865EA"
          />
          <rect x="40" y="48" width="56" height="6" rx="3" fill="white" opacity="0.95" />
          <rect x="40" y="62" width="72" height="6" rx="3" fill="white" opacity="0.75" />
          <rect x="40" y="76" width="44" height="6" rx="3" fill="white" opacity="0.55" />
        </svg>
      </div>
      <h2 className="text-foreground mt-2 text-lg font-semibold md:text-xl">Select a conversation</h2>
      <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
        Choose a chat from the list to view messages with your provider.
      </p>
    </div>
  );
}
