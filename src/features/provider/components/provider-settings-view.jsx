"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BadgePercent,
  CalendarClock,
  ChevronRight,
  FileText,
  ImagePlus,
  Languages,
  LayoutGrid,
  LogOut,
  Pencil,
  Star,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import { ROUTES } from "@/constants/routes.constants";
import { currentProvider } from "@/mock/providers";
import { useProviderAuthStore, useProviderProfileStore } from "@/store";
import { cn } from "@/lib/utils";

function SettingsSection({ title, children }) {
  return (
    <section>
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

function SettingsMenuItem({ href, label, icon: Icon, iconWrapClass, onClick }) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconWrapClass,
        )}
      >
        <Icon className="size-5" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1 text-[14.5px] font-medium text-[#0F172A]">
        {label}
      </span>
      <ChevronRight className="size-4 shrink-0 text-[#94A3B8]" />
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
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <h1 className="text-lg font-bold text-[#111827]">Settings</h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5 lg:px-6 lg:py-8">
          <h1 className="hidden text-2xl font-bold text-[#111827] lg:block">
            Settings
          </h1>

          <div className="relative isolate overflow-hidden rounded-[1.35rem] bg-gradient-to-br from-[#1865EA] via-[#1A6CF0] to-[#4B8BF5] shadow-[0_10px_28px_rgba(24,101,234,0.28)]">
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
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#1865EA] shadow-sm transition-opacity hover:opacity-90"
                  aria-label="Edit profile"
                >
                  <Pencil className="size-4" strokeWidth={2.2} />
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

          <SettingsSection title="Business Info">
            <SettingsMenuItem
              href={`${ROUTES.PROVIDER_SETTINGS_PROFILE}?tab=service`}
              label="Service Details"
              icon={FileText}
              iconWrapClass="bg-[#E8F1FF] text-[#1865EA]"
            />
            <SettingsMenuItem
              href={ROUTES.PROVIDER_SERVICES}
              label="My Services"
              icon={Wrench}
              iconWrapClass="bg-[#E0F2FE] text-[#0284C7]"
            />
            <SettingsMenuItem
              label="Upload Photo & Videos"
              icon={ImagePlus}
              iconWrapClass="bg-[#FFE8EE] text-[#EC407A]"
              onClick={() => comingSoon("Upload Photo & Videos")}
            />
            <SettingsMenuItem
              href={ROUTES.PROVIDER_SLOTS}
              label="Slot Management"
              icon={CalendarClock}
              iconWrapClass="bg-[#FFE4EC] text-[#E91E63]"
            />
          </SettingsSection>

          <SettingsSection title="Operations">
            <SettingsMenuItem
              label="Suggest Category"
              icon={LayoutGrid}
              iconWrapClass="bg-[#F3E8FF] text-[#9333EA]"
              onClick={() => comingSoon("Suggest Category")}
            />
            <SettingsMenuItem
              href={ROUTES.PROVIDER_PACKAGES}
              label="Packages"
              icon={BadgePercent}
              iconWrapClass="bg-[#E0F2FE] text-[#0284C7]"
            />
            <SettingsMenuItem
              href={ROUTES.PROVIDER_RATINGS}
              label="My Ratings"
              icon={Star}
              iconWrapClass="bg-[#FFE8DE] text-[#EA580C]"
            />
            <SettingsMenuItem
              label="Language"
              icon={Languages}
              iconWrapClass="bg-[#FFE4EC] text-[#DB2777]"
              onClick={() => comingSoon("Language")}
            />
          </SettingsSection>

          <button
            type="button"
            onClick={() => setLogoutOpen(true)}
            className="flex w-full items-center gap-3 rounded-2xl border border-[#FECACA]/60 bg-[#FFF1F2] px-4 py-3.5 text-left transition-colors hover:bg-[#FFE4E6]"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#F97316] to-[#EF4444] text-white shadow-sm">
              <LogOut className="size-5" strokeWidth={2} />
            </span>
            <span className="text-[14.5px] font-medium text-[#0F172A]">Sign out</span>
          </button>
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
