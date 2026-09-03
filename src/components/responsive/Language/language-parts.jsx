"use client";

import { cn } from "@/lib/utils";
import { RadioIndicator } from "@/components/ui/radio-indicator";

export const APP_LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "gb" },
  { code: "hi", label: "Hindi", flag: "in" },
  { code: "fil", label: "Philippines", flag: "ph" },
  { code: "fr", label: "Française", flag: "fr" },
  { code: "es", label: "Española", flag: "es" },
  { code: "pt", label: "Portuguese", flag: "pt" },
];

function LanguageFlag({ code, label }) {
  return (
    <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-[#EEF2F7] ring-1 ring-[#E5E7EB]">
      <img
        src={`https://flagcdn.com/w80/${code}.png`}
        alt=""
        width={40}
        height={40}
        className="size-full object-cover"
        draggable={false}
        aria-hidden
      />
      <span className="sr-only">{label} flag</span>
    </span>
  );
}

/** Desktop / tablet list — unchanged layout */
export function LanguageOption({ active, label, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-4 text-left transition-colors",
        active
          ? "border-primary bg-[#EFF6FF]"
          : "border-border/60 bg-background hover:bg-[#F8FAFC]",
      )}
    >
      <RadioIndicator selected={active} />
      <span className="text-foreground text-[15px] font-medium">{label}</span>
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

/** Language option row — flag + label + radio (mobile design, also used on web) */
export function LanguageMobileOption({ active, label, flag, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onSelect}
      className="flex w-full items-center gap-3 rounded-2xl border border-[#EEEEEE] bg-white px-4 py-[15px] text-left shadow-[0_1px_6px_rgba(16,24,40,0.04)] transition-colors hover:bg-[#F8FAFC] active:bg-[#F8FAFC]"
    >
      <LanguageFlag code={flag} label={label} />
      <span className="min-w-0 flex-1 text-[15px] font-medium text-[#111827]">
        {label}
      </span>
      <RadioIndicator selected={active} variant="app" />
    </button>
  );
}

export function LanguageMobileOptionsList({ selectedCode, onSelect }) {
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Select language">
      {APP_LANGUAGE_OPTIONS.map((option) => (
        <LanguageMobileOption
          key={option.code}
          active={selectedCode === option.code}
          label={option.label}
          flag={option.flag}
          onSelect={() => onSelect(option.code)}
        />
      ))}
    </div>
  );
}
