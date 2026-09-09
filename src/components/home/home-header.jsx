"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import { HeroHeartIcon } from "@/components/icons/hero-nav-icons";
import { SearchIcon } from "@/components/icons/search-icon";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { useWebLocale } from "@/hooks/use-web-locale";
import { getWebMessages } from "@/lib/i18n/web-messages";
import { HOME_PAGE_CONTAINER } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { useNotificationStore, useProfileStore } from "@/store";
import { toast } from "sonner";

const DESKTOP_NAV = [
  { href: "/#categories", labelKey: "navCategories" },
  { href: "/#professionals", labelKey: "navProfessionals" },
  { href: "/#packages", labelKey: "navPackages" },
  { href: "/#popular", labelKey: "navPopular" },
];

/** Header language dropdown — reference-style 2-column flag grid */
const HEADER_LANGUAGE_OPTIONS = [
  { code: "en", label: "English", flag: "us" },
  { code: "id", label: "Indonesian", flag: "id" },
  { code: "it", label: "Italian", flag: "it" },
  { code: "te", label: "Telugu", flag: "in" },
  { code: "ta", label: "Tamil", flag: "in" },
  { code: "sw", label: "Swahili", flag: "ke" },
  { code: "tr", label: "Turkish", flag: "tr" },
  { code: "ko", label: "Korean", flag: "kr" },
  { code: "pt", label: "Portuguese", flag: "pt" },
  { code: "zh", label: "Chinese", flag: "cn" },
  { code: "es", label: "Spanish", flag: "es" },
  { code: "ru", label: "Russian", flag: "ru" },
  { code: "hi", label: "Hindi", flag: "in" },
  { code: "de", label: "German", flag: "de" },
  { code: "fr", label: "French", flag: "fr" },
  { code: "ar", label: "Arabic", flag: "sa" },
  { code: "ja", label: "Japanese", flag: "jp" },
  { code: "bn", label: "Bengali", flag: "bd" },
];

function LanguageFlag({ code, label, size = "sm" }) {
  const dim = size === "md" ? 28 : 20;
  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-full bg-[#EEF2F7] ring-1 ring-[#E5E7EB]",
        size === "md" ? "size-7" : "size-5",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://flagcdn.com/w80/${code}.png`}
        alt=""
        width={dim}
        height={dim}
        className="size-full object-cover"
        draggable={false}
        aria-hidden
      />
      <span className="sr-only">{label} flag</span>
    </span>
  );
}

/** Desktop-only language selector — 2-column flag dropdown */
function LanguageDropdown({ selectedCode, onSelect }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected =
    HEADER_LANGUAGE_OPTIONS.find((option) => option.code === selectedCode) ||
    HEADER_LANGUAGE_OPTIONS[0];

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative hidden xl:block">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border border-[#E8ECF2] bg-[#FAFBFC] px-2.5 py-1.5",
          "text-sm font-medium text-[#475467] transition-colors",
          "hover:border-primary/30 hover:text-primary",
          open && "border-primary/30 text-primary",
        )}
      >
        <LanguageFlag code={selected.flag} label={selected.label} />
        <span className="max-w-[7.5rem] truncate">{selected.label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Choose language"
          className={cn(
            "absolute top-[calc(100%+0.5rem)] right-0 z-50 w-[22rem]",
            "rounded-2xl border border-[#E8ECF2] bg-white p-2",
            "shadow-[0_16px_40px_-16px_rgba(15,23,42,0.28)]",
          )}
        >
          <div className="scrollbar-hide grid max-h-72 grid-cols-2 gap-1 overflow-y-auto pr-1">
            {HEADER_LANGUAGE_OPTIONS.map((option) => {
              const active = selected.code === option.code;
              return (
                <button
                  key={option.code}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onSelect(option.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition-colors",
                    active
                      ? "bg-[#EAF1FF] text-[#1865EA]"
                      : "text-[#0F1B2D] hover:bg-[#F5F7FA]",
                  )}
                >
                  <LanguageFlag code={option.flag} label={option.label} size="md" />
                  <span className="truncate text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function HomeHeader({ embedded = false }) {
  const { profile, addresses, setLanguage } = useProfileStore();
  const unreadCount = useNotificationStore((state) => state.unreadCount("user"));
  const { t } = useWebLocale();
  const defaultAddress = addresses.find((address) => address.isDefault) || addresses[0];
  const addressLabel = defaultAddress
    ? [defaultAddress.addressLine1, defaultAddress.city].filter(Boolean).join(", ")
    : "Add delivery address";
  const firstName = profile?.name?.split(" ")[0] || "User";
  const selectedLanguage = profile?.preferences?.language ?? "en";

  const handleSelectLanguage = (code) => {
    if (code === selectedLanguage) return;
    setLanguage(code);
    toast.success(getWebMessages(code).languageUpdated);
  };

  return (
    <header
      className={cn(
        "safe-top bg-background/95 backdrop-blur-md",
        !embedded && "sticky top-0 z-40",
        "md:border-b md:border-[#EEF0F4] md:bg-white/95 md:shadow-[0_1px_0_rgba(15,23,42,0.04)] md:backdrop-blur-xl",
      )}
    >
      <div className={cn(HOME_PAGE_CONTAINER)}>
        {/* Mobile header — unchanged */}
        <div className="pt-3 pb-3 md:hidden">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Link href={ROUTES.PROFILE} className="shrink-0">
                <Avatar
                  src={profile.avatar}
                  name={profile.name}
                  size="md"
                  className="ring-border ring-2"
                />
              </Link>
              <div className="min-w-0">
                <Link href={ROUTES.PROFILE} className="block">
                  <p className="text-foreground truncate text-base font-semibold">
                    {profile.name}
                  </p>
                </Link>
                <Link
                  href={ROUTES.ADDRESSES}
                  className="text-muted-foreground mt-0.5 inline-flex max-w-full min-w-0 items-center gap-0.5 text-xs"
                >
                  <span className="truncate">{addressLabel}</span>
                  <ChevronDown className="size-3.5 shrink-0" aria-hidden />
                </Link>
              </div>
            </div>
            <Link
              href={ROUTES.NOTIFICATIONS}
              className="text-foreground hover:bg-muted relative flex size-10 shrink-0 items-center justify-center rounded-full bg-[#FFFFFF] transition-colors"
              aria-label="Notifications"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
                className="size-5 shrink-0"
              >
                <path
                  d="M14.5769 18.5C14.8104 18.5001 14.9995 18.6893 14.9998 18.9229C14.9998 18.9735 14.9914 19.0244 14.9724 19.0713C14.515 20.199 13.3563 21 11.9998 21C10.6433 20.9999 9.48541 20.1989 9.02807 19.0713C9.00904 19.0243 8.99975 18.9735 8.99975 18.9229C8.99999 18.6893 9.18995 18.5 9.42358 18.5H14.5769ZM11.9998 3C15.2288 3 17.9458 5.49083 18.3201 8.79395L18.6648 11.8389C18.7505 12.5952 19.0578 13.3068 19.5447 13.8799C20.5781 15.0962 19.739 17 18.1697 17H5.82983C4.2607 16.9998 3.42247 15.0961 4.45581 13.8799C4.94257 13.3068 5.24897 12.5951 5.33471 11.8389L5.67944 8.79395C6.05364 5.49088 8.77083 3.00013 11.9998 3Z"
                  fill="currentColor"
                />
              </svg>
              {unreadCount > 0 ? (
                <span
                  className="bg-destructive absolute top-2 right-2 size-2 rounded-full ring-2 ring-[#FFFFFF]"
                  aria-hidden
                />
              ) : null}
            </Link>
          </div>

          <Link
            href={ROUTES.SEARCH}
            aria-label="Search providers"
            className="relative mt-4 block w-full"
          >
            <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 z-10 size-4 -translate-y-1/2" />
            <div
              className={cn(
                "bg-background text-muted-foreground border-[#F0F0F0]",
                "flex h-11 w-full items-center rounded-full border pl-10 text-sm",
              )}
            >
              Search...
            </div>
          </Link>
        </div>

        {/* Desktop header — marketplace nav */}
        <div className="hidden h-[4.5rem] items-center gap-5 md:flex lg:gap-8">
          <Link href={ROUTES.HOME} className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/images/app-icon.jpg"
              alt="Bookento"
              width={42}
              height={42}
              className="size-[42px] rounded-lg shadow-sm"
              priority
            />
            <span className="text-foreground text-[1.15rem] font-bold tracking-tight">
              Bookento
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {DESKTOP_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:bg-accent hover:text-primary rounded-full px-3.5 py-2 text-sm font-medium text-[#667085] transition-colors"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-0 lg:gap-2.5">
            <LanguageDropdown
              selectedCode={selectedLanguage}
              onSelect={handleSelectLanguage}
            />

            <Link
              href={ROUTES.SAVED}
              aria-label="Saved providers"
              className="hover:bg-accent hover:text-primary flex size-10 items-center justify-center rounded-full text-[#667085] transition-colors"
            >
              <HeroHeartIcon tone="dark" className="size-5" />
            </Link>

            <Link
              href={ROUTES.PROFILE}
              className="ml-1 flex items-center gap-2 rounded-full py-1 pr-1 pl-1 transition-colors hover:bg-[#F5F7FA]"
            >
              <Avatar
                src={profile.avatar}
                name={profile.name}
                size="sm"
                className="ring-1 ring-[#E8ECF2]"
              />
              <span className="hidden text-sm font-medium text-[#0F1B2D] xl:inline">
                {t("hiUser", { name: firstName })}
              </span>
              <ChevronDown
                className="hidden size-3.5 text-[#98A2B3] xl:inline"
                aria-hidden
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
