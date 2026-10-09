"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import {
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { ROUTES } from "@/constants/routes.constants";
import { currentProvider } from "@/mock/providers";
import { useProviderAuthStore, useProviderProfileStore } from "@/store";
import { cn } from "@/lib/utils";

function SettingsSection({ title, children, className }) {
  return (
    <section className={className}>
      <div className="mb-3 flex items-center gap-2">
        <span className="h-4 w-1 shrink-0 rounded-full bg-[#1865EA]" aria-hidden />
        <h2 className="text-base font-bold text-[#1F2937]">{title}</h2>
      </div>
      <div className="divide-y divide-[#EEF1F6] overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        {children}
      </div>
    </section>
  );
}

function SettingsMenuItem({ href, label, iconSrc, iconWrapClass, onClick }) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconWrapClass,
        )}
      >
        <img src={iconSrc} alt="" className="size-5 object-contain" draggable={false} />
      </span>
      <span className="min-w-0 flex-1 text-[14.5px] font-medium text-[#0F172A]">
        {label}
      </span>
      <ChevronRight className="size-4 shrink-0 text-[#94A3B8]" strokeWidth={2.2} />
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-[#F8FAFF]"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-[#F8FAFF]"
    >
      {content}
    </Link>
  );
}

function comingSoon(label) {
  toast.message(`${label} — Coming soon`);
}

function formatStat(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? "0");
  return n < 10 ? String(n).padStart(2, "0") : String(n);
}

export function ProviderSettingsView() {
  const router = useRouter();
  const logout = useProviderAuthStore((s) => s.logout);
  const authProvider = useProviderAuthStore((s) => s.provider);
  const profile = useProviderProfileStore((s) => s.profile);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const data = {
    ...currentProvider,
    ...profile,
    avatar: profile?.avatar || authProvider?.avatar || currentProvider.avatar,
    businessName:
      profile?.businessName ||
      authProvider?.businessName ||
      currentProvider.businessName,
    specialty: profile?.specialty || currentProvider.specialty,
  };

  const stats = data.settingsStats || currentProvider.settingsStats;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success("Signed out");
      setLogoutOpen(false);
      router.push(ROUTES.PROVIDER_LOGIN);
    } catch {
      toast.error("Could not sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F7FF]">
      <header className="sticky top-0 z-20 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm lg:hidden">
        <div className={PROVIDER_MOBILE_HEADER}>
          <h1 className="text-lg font-bold text-[#111827]">Settings</h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(PROVIDER_PAGE_SHELL, "space-y-5 py-5 lg:py-8")}>
          <h1 className="hidden text-2xl font-bold text-[#111827] lg:block">
            Settings
          </h1>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start xl:grid-cols-[minmax(0,26rem)_1fr]">
            <div className="relative isolate overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-[#1865EA] via-[#1A6CF0] to-[#4B8BF5] shadow-[0_10px_28px_rgba(24,101,234,0.28)] lg:sticky lg:top-6">
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                aria-hidden
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 88% 18%, rgba(255,255,255,0.28), transparent 38%), radial-gradient(circle at 12% 90%, rgba(255,255,255,0.12), transparent 40%)",
                }}
              />

              <div className="relative z-10 p-4 pb-3.5">
                <div className="flex items-start gap-3">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white/40 bg-white/20">
                    <Image
                      src={data.avatar || "/icons/provider-expert-logo.png"}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="truncate text-[17px] font-bold text-white">
                      {data.businessName}
                    </p>
                    <p className="mt-0.5 truncate text-[13px] font-medium text-white/85">
                      {data.specialty}
                    </p>
                  </div>
                  <Link
                    href={ROUTES.PROVIDER_SETTINGS_PROFILE}
                    className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm transition-opacity hover:opacity-90"
                    aria-label="Edit profile"
                  >
                    <img
                      src={PROVIDER_ICONS.edit}
                      alt=""
                      className="size-4 object-contain"
                      draggable={false}
                    />
                  </Link>
                </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 border-t border-white/20 bg-[#0F4FCB]/35">
                {[
                  { label: "Earnings", value: stats.earnings },
                  { label: "Bookings", value: stats.bookings },
                  { label: "Reviews", value: stats.reviews },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className={cn(
                      "flex flex-col items-center justify-center px-2 py-3.5",
                      index > 0 && "border-l border-white/25",
                    )}
                  >
                    <p className="text-[20px] leading-none font-bold tracking-tight text-white">
                      {formatStat(item.value)}
                    </p>
                    <p className="mt-1.5 text-[11.5px] font-medium text-white/85">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <SettingsSection title="Business Info">
                <SettingsMenuItem
                  href={`${ROUTES.PROVIDER_SETTINGS_PROFILE}?tab=service`}
                  label="Service Details"
                  iconSrc={PROVIDER_ICONS.serviceDetails}
                  iconWrapClass="bg-[#E8F1FF]"
                />
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_MEDIA}
                  label="Upload Photo & Videos"
                  iconSrc={PROVIDER_ICONS.uploadMedia}
                  iconWrapClass="bg-[#FFE8EE]"
                />
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_SLOTS}
                  label="Slot Management"
                  iconSrc={PROVIDER_ICONS.slots}
                  iconWrapClass="bg-[#FFE4EC]"
                />
              </SettingsSection>

              <SettingsSection title="Operations">
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_CATEGORIES}
                  label="Suggest Category"
                  iconSrc={PROVIDER_ICONS.category}
                  iconWrapClass="bg-[#F3E8FF]"
                />
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_PACKAGES}
                  label="Packages"
                  iconSrc={PROVIDER_ICONS.packages}
                  iconWrapClass="bg-[#E0F2FE]"
                />
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_RATINGS}
                  label="My Ratings"
                  iconSrc={PROVIDER_ICONS.ratings}
                  iconWrapClass="bg-[#FFE8DE]"
                />
              </SettingsSection>

              {/* Desktop-only extras — mobile Settings matches screenshot 05 */}
              <SettingsSection title="More" className="hidden lg:block">
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_SERVICES}
                  label="My Services"
                  iconSrc={PROVIDER_ICONS.document}
                  iconWrapClass="bg-[#E0F2FE]"
                />
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_BRANCHES}
                  label="Branches"
                  iconSrc={PROVIDER_ICONS.building}
                  iconWrapClass="bg-[#EEF2FF]"
                />
                <SettingsMenuItem
                  href={ROUTES.PROVIDER_ANALYTICS}
                  label="Analytics"
                  iconSrc={PROVIDER_ICONS.filter}
                  iconWrapClass="bg-[#ECFDF5]"
                />
                <SettingsMenuItem
                  label="Language"
                  iconSrc={PROVIDER_ICONS.language}
                  iconWrapClass="bg-[#FFE4EC]"
                  onClick={() => comingSoon("Language")}
                />
              </SettingsSection>

              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="flex w-full items-center gap-3 rounded-2xl border border-[#FECACA]/60 bg-[#FFF1F2] px-4 py-3.5 text-left transition-colors hover:bg-[#FFE4E6]"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#FEE2E2]">
                  <img
                    src={PROVIDER_ICONS.logout}
                    alt=""
                    className="size-5 object-contain brightness-0"
                    draggable={false}
                  />
                </span>
                <span className="text-[14.5px] font-medium text-[#0F172A]">
                  Sign out
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <LogoutConfirmResponsive
        open={logoutOpen}
        onOpenChange={setLogoutOpen}
        onConfirm={handleLogout}
        loading={loggingOut}
        description="You will need to sign in again to access your provider dashboard."
      />
    </div>
  );
}
