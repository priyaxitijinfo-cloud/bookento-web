"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import { ROUTES } from "@/constants/routes.constants";
import { PROVIDER_ICONS } from "@/features/provider/provider-icons";
import {
  PROVIDER_MOBILE_HEADER,
  PROVIDER_PAGE_SHELL,
} from "@/lib/layout/page-layout.constants";
import { currentProvider } from "@/mock/providers";
import { useProviderAuthStore } from "@/store";
import { cn } from "@/lib/utils";

function ProfileSection({ title, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="bg-primary h-4 w-1 shrink-0 rounded-full" aria-hidden />
        <h2 className="text-base font-bold text-[#1F2937]">{title}</h2>
      </div>
      <div className="divide-y divide-[#EEF1F6] overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        {children}
      </div>
    </section>
  );
}

function ProfileMenuItem({ href, label, iconSrc, iconWrapClass, onClick }) {
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
      <img
        src={PROVIDER_ICONS.chevronRight}
        alt=""
        className="size-4 shrink-0 object-contain opacity-50"
        draggable={false}
      />
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

export function ProviderProfileView() {
  const router = useRouter();
  const logout = useProviderAuthStore((s) => s.logout);
  const provider = useProviderAuthStore((s) => s.provider);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const name = provider?.name || currentProvider.ownerName;
  const businessName = provider?.businessName || currentProvider.businessName;
  const email = provider?.email || currentProvider.email;
  const avatar = provider?.avatar || currentProvider.avatar;

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
          <h1 className="text-lg font-bold text-[#111827]">Profile</h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className={cn(PROVIDER_PAGE_SHELL, "space-y-5 py-5 lg:py-8")}>
          <div className="overflow-hidden rounded-2xl border border-[#EEF1F6] bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-3.5 p-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-[#E8F1FF]">
                <Image
                  src={avatar || "/icons/provider-expert-logo.png"}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] font-bold text-[#0F172A]">{name}</p>
                <p className="truncate text-[13px] text-[#64748B]">{businessName}</p>
                <p className="mt-0.5 truncate text-[12.5px] text-[#94A3B8]">{email}</p>
              </div>
              <Link
                href={ROUTES.PROVIDER_SETTINGS_PROFILE}
                className="text-primary shrink-0 text-[13px] font-semibold hover:underline"
              >
                Edit
              </Link>
            </div>
          </div>

          <ProfileSection title="Business">
            <ProfileMenuItem
              href={ROUTES.PROVIDER_SERVICES}
              label="My Services"
              iconSrc={PROVIDER_ICONS.serviceDetails}
              iconWrapClass="bg-[#E8F1FF]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_PACKAGES}
              label="Packages"
              iconSrc={PROVIDER_ICONS.packages}
              iconWrapClass="bg-[#FFF0F3]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_BRANCHES}
              label="Branches"
              iconSrc={PROVIDER_ICONS.building}
              iconWrapClass="bg-[#E6F7ED]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_CATEGORIES}
              label="Categories"
              iconSrc={PROVIDER_ICONS.category}
              iconWrapClass="bg-[#FFF4E5]"
            />
          </ProfileSection>

          <ProfileSection title="Content & Insights">
            <ProfileMenuItem
              href={ROUTES.PROVIDER_POSTS}
              label="Posts"
              iconSrc={PROVIDER_ICONS.gallery}
              iconWrapClass="bg-[#EEF2FF]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_REELS}
              label="Reels"
              iconSrc={PROVIDER_ICONS.video}
              iconWrapClass="bg-[#DBEAFE]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_RATINGS}
              label="Ratings"
              iconSrc={PROVIDER_ICONS.starFilled}
              iconWrapClass="bg-[#FEF3C7]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_ANALYTICS}
              label="Analytics"
              iconSrc={PROVIDER_ICONS.analytics}
              iconWrapClass="bg-[#E0F2FE]"
            />
          </ProfileSection>

          <ProfileSection title="Account">
            <ProfileMenuItem
              href={ROUTES.PROVIDER_NOTIFICATIONS}
              label="Notifications"
              iconSrc={PROVIDER_ICONS.bell}
              iconWrapClass="bg-[#FEE2E2]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_SETTINGS}
              label="Settings"
              iconSrc={PROVIDER_ICONS.settings}
              iconWrapClass="bg-[#F1F5F9]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_SETTINGS_PROFILE}
              label="Edit Profile"
              iconSrc={PROVIDER_ICONS.user}
              iconWrapClass="bg-[#E8F1FF]"
            />
            <ProfileMenuItem
              label="Logout"
              iconSrc={PROVIDER_ICONS.logout}
              iconWrapClass="bg-[#FEECEC]"
              onClick={() => setLogoutOpen(true)}
            />
          </ProfileSection>
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
