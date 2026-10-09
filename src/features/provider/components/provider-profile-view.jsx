"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  Building2,
  ChevronRight,
  Film,
  Image as ImageIcon,
  Layers,
  LogOut,
  Package,
  Settings,
  Star,
  UserRound,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";

import { LogoutConfirmResponsive } from "@/components/responsive/Dialogs";
import { ROUTES } from "@/constants/routes.constants";
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

function ProfileMenuItem({ href, label, icon: Icon, iconWrapClass, onClick }) {
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
        <div className="mx-auto flex h-14 max-w-3xl items-center px-4">
          <h1 className="text-lg font-bold text-[#111827]">Profile</h1>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-3xl space-y-5 px-4 py-5 lg:px-6 lg:py-8">
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
              icon={Wrench}
              iconWrapClass="bg-[#E8F1FF] text-[#1865EA]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_PACKAGES}
              label="Packages"
              icon={Package}
              iconWrapClass="bg-[#FFF0F3] text-[#EC407A]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_BRANCHES}
              label="Branches"
              icon={Building2}
              iconWrapClass="bg-[#E6F7ED] text-[#16A34A]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_CATEGORIES}
              label="Categories"
              icon={Layers}
              iconWrapClass="bg-[#FFF4E5] text-[#E67E22]"
            />
          </ProfileSection>

          <ProfileSection title="Content & Insights">
            <ProfileMenuItem
              href={ROUTES.PROVIDER_POSTS}
              label="Posts"
              icon={ImageIcon}
              iconWrapClass="bg-[#EEF2FF] text-[#6366F1]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_REELS}
              label="Reels"
              icon={Film}
              iconWrapClass="bg-[#DBEAFE] text-[#2563EB]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_RATINGS}
              label="Ratings"
              icon={Star}
              iconWrapClass="bg-[#FEF3C7] text-[#D97706]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_ANALYTICS}
              label="Analytics"
              icon={BarChart3}
              iconWrapClass="bg-[#E0F2FE] text-[#0284C7]"
            />
          </ProfileSection>

          <ProfileSection title="Account">
            <ProfileMenuItem
              href={ROUTES.PROVIDER_NOTIFICATIONS}
              label="Notifications"
              icon={Bell}
              iconWrapClass="bg-[#FEE2E2] text-[#EF4444]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_SETTINGS}
              label="Settings"
              icon={Settings}
              iconWrapClass="bg-[#F1F5F9] text-[#475569]"
            />
            <ProfileMenuItem
              href={ROUTES.PROVIDER_SETTINGS_PROFILE}
              label="Edit Profile"
              icon={UserRound}
              iconWrapClass="bg-[#E8F1FF] text-[#1865EA]"
            />
            <ProfileMenuItem
              label="Logout"
              icon={LogOut}
              iconWrapClass="bg-[#FEECEC] text-[#EF4444]"
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
