"use client";

import Image from "next/image";
import Link from "next/link";
import { cloneElement, isValidElement, useEffect, useRef, useState } from "react";
import { CalendarCheck2, ChevronDown, ShieldCheck, Sparkles, X } from "lucide-react";

import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";
import { countries } from "@/mock/languages";
import { formatNationalPhone, parseNationalPhone } from "@/features/auth/lib/phone";

const AUTH_PANEL_HIGHLIGHTS = [
  { icon: ShieldCheck, label: "Verified professionals" },
  { icon: CalendarCheck2, label: "Book in minutes" },
  { icon: Sparkles, label: "In person or online" },
];

const FLAG_CDN_CODE = {
  IN: "in",
  US: "us",
  GB: "gb",
  AE: "ae",
  SG: "sg",
  AU: "au",
  CA: "ca",
  SA: "sa",
  QA: "qa",
  KW: "kw",
  OM: "om",
  BH: "bh",
  MY: "my",
  TH: "th",
  JP: "jp",
  KR: "kr",
  NP: "np",
  BD: "bd",
  LK: "lk",
  PK: "pk",
  DE: "de",
  FR: "fr",
  NL: "nl",
  IT: "it",
  ES: "es",
  NZ: "nz",
  ZA: "za",
  PH: "ph",
  ID: "id",
  HK: "hk",
};

export function CountryFlag({ code, className }) {
  const flagCode = FLAG_CDN_CODE[code] || code?.toLowerCase();

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 overflow-hidden rounded-full bg-[#EEF2F7] ring-1 ring-[#E5E7EB]",
        className,
      )}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w80/${flagCode}.png`}
        alt=""
        width={40}
        height={40}
        className="size-full object-cover"
        draggable={false}
      />
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
    <div className={cn("relative", variant === "app" ? "my-1.5" : "my-2")}>
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
    <svg
      viewBox="0 0 24 24"
      width={32}
      height={32}
      className="h-[32px] w-[32px] shrink-0"
      aria-hidden
      fill="currentColor"
    >
      <path d="M16.7 12.5c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.2-2.8.9-3.5.9-.7 0-1.9-.8-3.1-.8-1.6 0-3.1 1-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.6.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8s1.8.8 3.1.8c1.3 0 2.1-1.1 2.9-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zm-2.3-6.8c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1 .1 2-.5 2.7-1.3z" />
    </svg>
  );
}

const SOCIAL_PROVIDERS = [
  { id: "facebook", label: "Facebook", icon: FacebookMark },
  { id: "google", label: "Google", icon: GoogleMark },
  { id: "apple", label: "Apple", icon: AppleMark },
];

export function SocialAuthButtons({ onSelect, variant = "app", disabled = false }) {
  if (variant === "web") {
    return (
      <div className="grid grid-cols-3 gap-3.5">
        {SOCIAL_PROVIDERS.map((provider) => {
          const Icon = provider.icon;
          return (
            <button
              key={provider.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(provider.label)}
              className="flex flex-col items-center justify-center gap-2 rounded-[1rem] border border-[#F2F2F2] bg-white px-2 py-3.5 transition-colors hover:border-[#D6E4FF] hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Icon />
              <span className="text-[12px] font-medium text-[#667085]">
                {provider.label}
              </span>
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
            disabled={disabled}
            onClick={() => onSelect(provider.label)}
            className="flex flex-col items-center justify-center gap-2 rounded-[1rem] border border-[#F2F2F2] bg-white px-2 py-3.5 transition-colors active:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-label="Close country picker"
      />
      <div className="relative w-full max-w-[22.5rem] overflow-x-hidden overflow-y-hidden rounded-[1.5rem] bg-white px-2 pt-5 pb-3 shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <div className="mb-2 flex items-center justify-between border-b border-[#EEF1F6] px-3 pb-3">
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
        <div className="scrollbar-hide mt-4 max-h-[20rem] overflow-x-hidden overflow-y-auto overscroll-contain">
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
                  "flex w-full min-w-0 items-center gap-3 rounded-xl px-3 py-3 text-left",
                  selected && "bg-[#F4F8FF]",
                )}
              >
                <CountryFlag code={country.code} className="size-7 shrink-0" />
                <span className="min-w-0 flex-1 truncate text-[15px] font-medium text-[#111827]">
                  {country.name}
                </span>
                <span className="shrink-0 text-[15px] font-semibold text-[#4D5972]">
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
  variant: _variant = "app",
  placeholder = "Enter mobile number",
}) {
  return (
    <div>
      <div
        className={cn(
          "flex h-[3.35rem] items-center rounded-[0.65rem] bg-[#F2F6FC] p-1 focus-within:ring-2 focus-within:ring-[#1865EA]/20",
          error && "ring-destructive/40 ring-2",
        )}
      >
        <button
          type="button"
          onClick={onCountryClick}
          className="inline-flex h-full shrink-0 items-center gap-1.5 rounded-[0.45rem] bg-white px-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          aria-label="Select country code"
        >
          <CountryFlag code={country.code} className="size-6 shrink-0" />
          <span className="h-4 w-px shrink-0 bg-[#D5DCE6]" aria-hidden />
          <span className="text-[14px] font-semibold text-[#334155]">
            {country.dialCode}
          </span>
          <ChevronDown className="size-3.5 text-[#98A2B3]" />
        </button>
        <input
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formatNationalPhone(phone)}
          onChange={(e) =>
            onPhoneChange(parseNationalPhone(e.target.value, country.dialCode))
          }
          placeholder={placeholder}
          className="h-full min-w-0 flex-1 border-0 bg-transparent px-3 text-[14.5px] text-[#111827] outline-none placeholder:text-[#ADB3B7]"
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
            "text-center font-semibold text-[#111827] transition-[border-color,box-shadow,background-color] outline-none",
            isWeb
              ? "focus:border-primary focus:ring-primary/20 h-14 w-12 rounded-xl border border-[#E6EAF2] bg-white text-lg focus:ring-2"
              : cn(
                  "size-12 rounded-[0.65rem] border bg-[#F2F6FC] text-lg",
                  digit ? "border-[#1865EA] bg-white" : "border-[#E8EDF8]",
                  "focus:border-[#1865EA] focus:bg-white focus:ring-2 focus:ring-[#1865EA]/20",
                ),
          )}
        />
      ))}
    </div>
  );
}

export function AuthMobileFrame({ illustration, children }) {
  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#F4F7FF]">
      {/* Design background — soft pastel mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/auth/auth-mobile-bg.png)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pb-5">
        {illustration ? (
          <div className="flex shrink-0 flex-col items-center px-2 pt-12 pb-11">
            <div className="flex h-[11.75rem] w-full items-center justify-center">
              {illustration}
            </div>
          </div>
        ) : (
          <div className="h-6 shrink-0" aria-hidden />
        )}

        <div
          className={cn(
            "relative z-10 flex min-h-[38.375rem] flex-1 flex-col bg-white px-5 pt-7 pb-7",
            "rounded-[1.75rem] shadow-[0_12px_40px_rgba(15,23,42,0.1)]",
          )}
        >
          {children}
        </div>
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
  const desktopArt = isValidElement(illustration)
    ? cloneElement(illustration, { key: "desktop-art" })
    : illustration;
  const tabletArt = isValidElement(illustration)
    ? cloneElement(illustration, { key: "tablet-art" })
    : illustration;

  return (
    <div className="relative min-h-dvh overflow-x-hidden bg-[#F4F7FF]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url(/images/auth/auth-mobile-bg.png)" }}
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[84rem] items-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div
          className={cn(
            "grid w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.1)]",
            "lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
          )}
        >
          <aside className="relative hidden flex-col gap-8 border-r border-[#EEF1F6] bg-[#F8FAFF] px-10 py-10 lg:flex xl:px-12 xl:py-12">
            <Link href={ROUTES.HOME} className="inline-flex w-fit items-center gap-3">
              <Image
                src="/images/app-icon.jpg"
                alt="Bookento"
                width={48}
                height={48}
                className="size-12 rounded-[0.85rem] shadow-sm ring-1 ring-[#E5EAF3]"
                priority
              />
              <span className="text-[1.45rem] font-bold tracking-tight text-[#0F1B2D]">
                {eyebrow}
              </span>
            </Link>

            <div className="flex flex-col items-center">
              <div className="flex h-[13.5rem] w-full max-w-[18rem] items-center justify-center">
                {desktopArt}
              </div>

              <div className="mt-8 w-full max-w-sm text-center">
                <h2 className="text-[1.65rem] leading-tight font-bold tracking-tight text-[#0F1B2D]">
                  {headline}
                </h2>
                {copy ? (
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[#667085]">
                    {copy}
                  </p>
                ) : null}
              </div>
            </div>

            <ul className="grid gap-3">
              {AUTH_PANEL_HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-white px-3.5 py-3 text-[13.5px] font-medium text-[#334155] shadow-[0_4px_14px_rgba(15,23,42,0.04)] ring-1 ring-[#EEF1F6]"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EAF1FF] text-[#1865EA]">
                    <Icon className="size-3.5" strokeWidth={2.3} aria-hidden />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </aside>

          <main className="relative flex flex-col justify-center px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
            <Link
              href={ROUTES.HOME}
              className="mb-8 inline-flex w-fit items-center gap-2.5 lg:hidden"
            >
              <Image
                src="/images/app-icon.jpg"
                alt="Bookento"
                width={36}
                height={36}
                className="size-9 rounded-lg shadow-sm"
              />
              <span className="font-bold text-[#0F1B2D]">Bookento</span>
            </Link>

            {tabletArt ? (
              <div className="mb-6 flex h-[11.75rem] items-center justify-center lg:hidden">
                <div className="w-[14rem]">{tabletArt}</div>
              </div>
            ) : null}

            <div
              className={cn(
                "mx-auto flex w-full flex-col",
                wide ? "max-w-xl" : "max-w-[30rem]",
              )}
            >
              {children}
            </div>
          </main>
        </div>
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
