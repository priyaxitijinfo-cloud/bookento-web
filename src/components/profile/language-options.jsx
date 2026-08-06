"use client";

import { cn } from "@/lib/utils";

export const APP_LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
  { code: "fil", label: "Philippines" },
  { code: "fr", label: "Française" },
  { code: "es", label: "Española" },
  { code: "pt", label: "Portuguese" },
];

export function LanguageOption({ active, label, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-colors",
        active ? "border-primary bg-[#EFF6FF]" : "border-border/60 bg-background hover:bg-[#F8FAFC]",
      )}
    >
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          active ? "border-primary bg-primary" : "border-border bg-background",
        )}
        aria-hidden
      >
        {active ? <span className="size-2 rounded-full bg-background" /> : null}
      </span>
      <span className="text-[15px] font-medium text-foreground">{label}</span>
    </button>
  );
}

export function LanguageOptionsList({ selectedCode, onSelect }) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Select language">
      {APP_LANGUAGE_OPTIONS.map((option) => (
        <LanguageOption
          key={option.code}
          active={selectedCode === option.code}
          label={option.label}
          onSelect={() => onSelect(option.code)}
        />
      ))}
    </div>
  );
}
