"use client";

import { cn } from "@/lib/utils";

function EmptyChatIllustration({ className }) {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-full", className)}
      aria-hidden
    >
      <ellipse cx="100" cy="148" rx="70" ry="8" fill="#E2E8F0" opacity="0.7" />
      {/* Plant pot */}
      <path d="M148 118h28l-3 22a8 8 0 0 1-8 7h-6a8 8 0 0 1-8-7l-3-22z" fill="#FDBA74" />
      <rect x="145" y="112" width="34" height="8" rx="2" fill="#FB923C" />
      <path d="M162 112c0-18 10-28 10-40" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
      <path d="M162 100c-10-4-16-14-14-24" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="174" cy="72" rx="10" ry="14" fill="#4ADE80" opacity="0.9" />
      <ellipse cx="152" cy="78" rx="9" ry="12" fill="#22C55E" opacity="0.85" />
      {/* Small dotted bubble */}
      <rect x="128" y="48" width="36" height="28" rx="12" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
      <circle cx="138" cy="62" r="2.5" fill="#94A3B8" />
      <circle cx="146" cy="62" r="2.5" fill="#94A3B8" />
      <circle cx="154" cy="62" r="2.5" fill="#94A3B8" />
      {/* Main blue bubble */}
      <path
        d="M36 28h88a20 20 0 0 1 20 20v36a20 20 0 0 1-20 20H72l-18 16v-16H36A20 20 0 0 1 16 84V48A20 20 0 0 1 36 28z"
        fill="#1865EA"
      />
      <rect x="40" y="48" width="56" height="6" rx="3" fill="white" opacity="0.95" />
      <rect x="40" y="62" width="72" height="6" rx="3" fill="white" opacity="0.75" />
      <rect x="40" y="76" width="44" height="6" rx="3" fill="white" opacity="0.55" />
    </svg>
  );
}

export function ChatEmptyInbox({
  title = "Not Chats Yet",
  description = "Start a conversation about all your Service appointment.",
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-1 flex-col items-center justify-center px-6 py-16 text-center",
        className,
      )}
    >
      <div className="mb-6 size-44 md:size-52">
        <EmptyChatIllustration />
      </div>
      <h3 className="text-foreground text-xl font-bold tracking-tight">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-[16rem] text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
