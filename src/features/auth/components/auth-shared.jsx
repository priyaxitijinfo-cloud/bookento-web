"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { countries } from "@/mock/languages";
import { formatNationalPhone, parseNationalPhone } from "@/features/auth/lib/phone";

export function CountryFlag({ code, className }) {
  const clipId = useId();

  if (code === "IN") {
    return (
      <svg
        viewBox="0 0 24 24"
        className={className}
        aria-hidden
        xmlns="http://www.w3.org/2000/svg"
      >
        <clipPath id={clipId}>
          <circle cx="12" cy="12" r="12" />
        </clipPath>
        <g clipPath={`url(#${clipId})`}>
          <rect width="24" height="8" fill="#FF9933" />
          <rect y="8" width="24" height="8" fill="#FFFFFF" />
          <rect y="16" width="24" height="8" fill="#138808" />
          <circle cx="12" cy="12" r="2.4" fill="#000080" />
          <circle cx="12" cy="12" r="1.55" fill="#FFFFFF" />
          <circle cx="12" cy="12" r="0.6" fill="#000080" />
        </g>
      </svg>
    );
  }

  const emoji = { US: "🇺🇸", GB: "🇬🇧", AE: "🇦🇪", SG: "🇸🇬" }[code] ?? "🏳️";

  return (
    <span
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-full bg-[#EEF2F7] text-[13px] leading-none",
        className,
      )}
      aria-hidden
    >
      {emoji}
    </span>
  );
}

export function AuthPrimaryButton({
  children,
  className,
  loading = false,
  variant = "app",
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex w-full items-center justify-center gap-2 font-semibold text-white transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60",
        "gradient-brand shadow-[0_8px_20px_rgba(30,87,234,0.28)]",
        variant === "app"
          ? "h-12 rounded-full text-[15px]"
          : "h-12 rounded-xl text-sm md:h-[3.25rem] md:text-base",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}

export function OrDivider({ variant = "app" }) {
  return (
    <div className="relative my-1">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-[#EEF1F6]" />
      </div>
      <div className="relative flex justify-center text-xs">
        <span
          className={cn(
            "bg-white px-3 font-medium tracking-wide text-[#9AA3B2] uppercase",
            variant === "web" && "text-[11px]",
          )}
        >
          OR
        </span>
      </div>
    </div>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path
        fill="#1877F2"
        d="M24 12.07C24 5.42 18.63 0 12 0S0 5.42 0 12.07C0 18.1 4.39 23.09 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.09 24 18.1 24 12.07Z"
      />
    </svg>
  );
}

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.4H12v4.5h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h4c2.4-2.2 3.5-5.5 3.5-8.7Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1 7.9-2.8l-4-3c-1.1.8-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8H1.4v3.1C3.4 21.4 7.4 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.5 14.6c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2V7.1H1.4C.5 8.9 0 10.4 0 12.4c0 2 .5 3.5 1.4 5.3l4.1-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.5l4.1 3.1C6.4 6.8 9 4.8 12 4.8Z"
      />
    </svg>
  );
}

function AppleMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" aria-hidden fill="currentColor">
      <path d="M16.7 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zm-2.3-6.8c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

const SOCIAL_PROVIDERS = [
  { id: "facebook", label: "Facebook", icon: FacebookMark },
  { id: "google", label: "Google", icon: GoogleMark },
  { id: "apple", label: "Apple", icon: AppleMark },
];

export function SocialAuthButtons({ onSelect, variant = "app" }) {
  if (variant === "web") {
    return (
      <div className="grid grid-cols-3 gap-3">
        {SOCIAL_PROVIDERS.map((provider) => {
          const Icon = provider.icon;
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => onSelect(provider.label)}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-[#E7EBF2] bg-white px-2 text-sm font-medium text-[#334155] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[#F8FAFC]"
            >
              <Icon />
              <span className="hidden sm:inline">{provider.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {SOCIAL_PROVIDERS.map((provider) => {
        const Icon = provider.icon;
        return (
          <button
            key={provider.id}
            type="button"
            onClick={() => onSelect(provider.label)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#EEF1F6] bg-white px-2 py-3.5 shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
          >
            <Icon />
            <span className="text-[11px] font-medium text-[#667085]">
              {provider.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function CountryCodePicker({ open, value, onSelect, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close country picker"
      />
      <div className="relative w-full max-w-[22.5rem] overflow-hidden rounded-t-[1.5rem] bg-white px-2 pt-5 pb-3 shadow-[0_20px_60px_rgba(15,23,42,0.22)] sm:rounded-[1.5rem]">
        <div className="mb-3 flex items-center justify-between px-3">
          <h2 className="text-[1.125rem] font-bold text-[#111827]">Select country</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-[#F2F4F7] text-[#4D5972]"
            aria-label="Close"
          >
            <X className="size-[1.125rem]" strokeWidth={2.25} />
          </button>
        </div>
        <div className="max-h-[20rem] overflow-y-auto">
          {countries.map((country) => {
            const selected = country.code === value;
            return (
              <button
                key={country.code}
                type="button"
                onClick={() => {
                  onSelect(country.code);
                  onClose();
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left",
                  selected && "bg-[#F4F8FF]",
                )}
              >
                <CountryFlag code={country.code} className="size-7 shrink-0" />
                <span className="min-w-0 flex-1 text-[15px] font-medium text-[#111827]">
                  {country.name}
                </span>
                <span className="text-[15px] font-semibold text-[#4D5972]">
                  {country.dialCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PhoneNumberField({
  country,
  phone,
  onPhoneChange,
  onCountryClick,
  error,
  variant = "app",
  placeholder = "Enter mobile number",
}) {
  const isWeb = variant === "web";

  return (
    <div>
      <div
        className={cn(
          "flex items-center bg-white",
          isWeb
            ? "focus-within:ring-primary/20 h-12 rounded-xl border border-[#E6EAF2] focus-within:ring-2"
            : "focus-within:ring-primary/20 h-14 rounded-2xl border border-[#EEF1F6] px-1.5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] focus-within:ring-2",
          error && "border-destructive",
        )}
      >
        <button
          type="button"
          onClick={onCountryClick}
          className={cn(
            "inline-flex h-full shrink-0 items-center gap-1.5",
            isWeb ? "px-3" : "rounded-xl bg-[#F3F6FB] px-2.5",
          )}
          aria-label="Select country code"
        >
          <CountryFlag code={country.code} className="size-6 shrink-0" />
          <span className="h-4 w-px bg-[#D5DCE6]" aria-hidden />
          <span
            className={cn(
              "font-medium text-[#334155]",
              isWeb ? "text-sm" : "text-[15px]",
            )}
          >
            {country.dialCode}
          </span>
          <ChevronDown className="size-3.5 text-[#4D5972]" />
        </button>
        {isWeb && <span className="h-6 w-px bg-[#E6EAF2]" aria-hidden />}
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formatNationalPhone(phone)}
          onChange={(e) =>
            onPhoneChange(parseNationalPhone(e.target.value, country.dialCode))
          }
          placeholder={placeholder}
          className={cn(
            "h-full min-w-0 flex-1 border-0 bg-transparent text-[#111827] outline-none placeholder:text-[#ADB3B7]",
            isWeb ? "px-3 text-sm" : "px-3 text-[15px]",
          )}
        />
      </div>
      {error ? <p className="text-destructive mt-1.5 text-xs">{error}</p> : null}
    </div>
  );
}

export function OtpBoxes({ value, onChange, variant = "app" }) {
  const inputRefs = useRef([]);
  const length = value.length;
  const isWeb = variant === "web";

  const focusAt = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index, nextValue) => {
    if (!/^\d*$/.test(nextValue)) return;
    const digit = nextValue.slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      focusAt(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) focusAt(index - 1);
    if (event.key === "ArrowRight" && index < length - 1) focusAt(index + 1);
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    if (!pasted) return;
    const next = Array.from({ length }, (_, i) => pasted[i] || "");
    onChange(next);
    focusAt(Math.min(pasted.length, length - 1));
  };

  return (
    <div className={cn("flex justify-center", isWeb ? "gap-2.5" : "gap-2")}>
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            "text-center font-semibold text-[#111827] outline-none",
            isWeb
              ? "focus:border-primary focus:ring-primary/20 h-14 w-12 rounded-xl border border-[#E6EAF2] bg-white text-lg focus:ring-2"
              : "focus:border-primary size-12 rounded-2xl border border-[#EEF2FF] bg-[#F4F7FF] text-lg focus:bg-white",
          )}
        />
      ))}
    </div>
  );
}

export function AuthMobileFrame({ illustration, children }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-white">
      {illustration ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[linear-gradient(180deg,#FFE8DC_0%,#FFF4EE_42%,#FFFFFF_100%)]" />
      ) : null}
      <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pt-8 pb-8">
        {illustration ? (
          <div className="mb-2 flex justify-center pt-4">{illustration}</div>
        ) : (
          <div className="pt-6" />
        )}
        {children}
      </div>
    </div>
  );
}

export function AuthWebFrame({
  illustration,
  eyebrow = "Bookento",
  headline,
  copy,
  children,
  wide = false,
}) {
  return (
    <div className="min-h-dvh bg-[#F4F7FB]">
      <div className="mx-auto grid min-h-dvh w-full max-w-[88rem] lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#FFF1E8_0%,#EAF2FF_52%,#F7FAFF_100%)] px-12 py-10 lg:flex lg:flex-col lg:justify-between">
          <Link href={ROUTES.HOME} className="inline-flex items-center gap-2.5">
            <Image
              src="/images/app-icon.jpg"
              alt="Bookento"
              width={42}
              height={42}
              className="size-[42px] rounded-lg shadow-sm"
              priority
            />
            <span className="text-[1.15rem] font-bold tracking-tight text-[#111827]">
              {eyebrow}
            </span>
          </Link>
          <div>
            {illustration ? <div className="mb-8">{illustration}</div> : null}
            <h2 className="max-w-md text-3xl font-bold tracking-tight text-[#111827]">
              {headline}
            </h2>
            {copy ? (
              <p className="mt-3 max-w-md text-base leading-relaxed text-[#667085]">
                {copy}
              </p>
            ) : null}
          </div>
          <p className="text-sm text-[#98A2B3]">
            Trusted professionals, booked in minutes.
          </p>
        </aside>

        <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
          <div
            className={cn(
              "w-full rounded-[1.75rem] border border-[#EEF1F6] bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.06)] sm:p-8",
              wide ? "max-w-2xl" : "max-w-[28rem]",
            )}
          >
            <Link
              href={ROUTES.HOME}
              className="mb-6 inline-flex items-center gap-2 lg:hidden"
            >
              <Image
                src="/images/app-icon.jpg"
                alt="Bookento"
                width={36}
                height={36}
                className="size-9 rounded-lg shadow-sm"
              />
              <span className="font-bold text-[#111827]">Bookento</span>
            </Link>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function useCountry(initialCode = "IN") {
  const [countryCode, setCountryCode] = useState(initialCode);
  const [pickerOpen, setPickerOpen] = useState(false);
  const country = countries.find((item) => item.code === countryCode) ?? countries[0];
  return { country, countryCode, setCountryCode, pickerOpen, setPickerOpen };
}

export function useOtpCountdown(initial = 90) {
  const [countdown, setCountdown] = useState(initial);

  useEffect(() => {
    if (countdown <= 0) return undefined;
    const timer = setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  return { countdown, setCountdown, restart: () => setCountdown(initial) };
}
