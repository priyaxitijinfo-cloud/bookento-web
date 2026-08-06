"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, Mail, Pencil } from "lucide-react";
import { toast } from "sonner";

import { HomeHeader } from "@/components/home/home-header";
import {
  ProfileAddressesIcon,
  ProfileHelpIcon,
  ProfileLanguagesIcon,
  ProfileLogoutIcon,
  ProfileNotificationIcon,
  ProfilePrivacyIcon,
  ProfileReferralsIcon,
  ProfileReelsIcon,
  ProfileReviewsIcon,
  ProfileSavedIcon,
  ProfileTermsIcon,
  ProfileWalletIcon,
} from "@/components/icons/profile-icons";
import { UserBottomNav } from "@/components/layout/user-nav";
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { appendFromParam, buildReelsRoute, setBackFromSource } from "@/lib/navigation/back-navigation";
import { appointments } from "@/mock/appointments";
import { reviews } from "@/mock/reviews";
import { useUserAuthStore, useUserProfileStore } from "@/store";
import { cn } from "@/lib/utils";

function ProfileToggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition-all",
        checked ? "gradient-brand" : "bg-[#E5E7EB]",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

function ProfileSection({ title, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <span className="section-title-bar" aria-hidden />
        <h2 className="text-foreground text-base font-bold">{title}</h2>
      </div>
      <div className="divide-border/60 divide-y overflow-hidden rounded-2xl bg-background shadow-card">
        {children}
      </div>
    </section>
  );
}

function ProfileMenuItem({
  href,
  label,
  icon: Icon,
  iconWrapClass,
  iconClass,
  onClick,
  trailing,
}) {
  const inner = (
    <>
      <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", iconWrapClass)}>
        <Icon className={cn("size-[22px]", iconClass)} />
      </div>
      <span className="text-foreground min-w-0 flex-1 text-left text-[15px] font-medium">{label}</span>
      {trailing ?? <ChevronRight className="text-muted-foreground size-5 shrink-0" strokeWidth={2} />}
    </>
  );

  const className =
    "hover:bg-background flex w-full items-center gap-3 px-4 py-3.5 transition-colors";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {inner}
      </button>
    );
  }

  return <div className={className}>{inner}</div>;
}

function ProfileHeroCard({ profile, stats }) {
  return (
    <div className="gradient-brand relative overflow-hidden rounded-2xl p-4 shadow-[0_8px_24px_rgba(24,101,234,0.22)]">
      <div className="flex items-start gap-3">
        <Avatar src={profile.avatar} name={profile.name} size="lg" className="ring-2 ring-white/30" />
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="truncate text-lg font-bold text-white">{profile.name}</h2>
          <p className="truncate text-sm text-white/85">{profile.email}</p>
        </div>
        <button
          type="button"
          onClick={() => toast.message("Edit profile coming soon")}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background/20 text-white transition-colors hover:bg-background/30"
          aria-label="Edit profile"
        >
          <Pencil className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 rounded-xl bg-background/15 px-2 py-3 backdrop-blur-sm">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={cn("text-center", index > 0 && "border-l border-white/20")}
          >
            <p className="text-lg font-bold text-white">{stat.value}</p>
            <p className="text-[11px] text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopInlineSection({ title, children }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <span className="section-title-bar" aria-hidden />
        <h2 className="text-foreground text-base font-bold">{title}</h2>
      </div>
      <div className="divide-border/60 divide-y overflow-hidden rounded-xl border border-[#EEF2F7] bg-[#FAFBFD]">
        {children}
      </div>
    </section>
  );
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function DesktopProfileSidebar({ profile, stats }) {
  const fileInputRef = useRef(null);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState(false);
  const updateProfile = useUserProfileStore((state) => state.updateProfile);
  const isUploadedAvatar = profile.avatar?.startsWith("data:");

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setIsUpdatingPhoto(true);

    try {
      const avatar = await readFileAsDataUrl(file);
      const result = await updateProfile({ avatar });

      if (result?.success) {
        toast.success("Profile photo updated");
      } else {
        toast.error("Could not update profile photo");
      }
    } catch {
      toast.error("Could not update profile photo");
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  return (
    <aside className="shrink-0 self-start">
      <div className="overflow-hidden rounded-2xl bg-background shadow-card-hover">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#EEF2F7]">
          <Image
            src={profile.avatar}
            alt={profile.name}
            fill
            className="object-cover"
            sizes="(min-width: 1280px) 320px, 280px"
            priority
            unoptimized={isUploadedAvatar}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <button
            type="button"
            onClick={handleEditPhotoClick}
            disabled={isUpdatingPhoto}
            className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-background/95 text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Edit profile photo"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        <div className="border-t border-[#EEF2F7] bg-background px-5 py-5">
          <h2 className="text-foreground text-xl font-bold leading-tight">{profile.name}</h2>
          <div className="mt-3 space-y-2.5">
            <p className="text-muted-foreground flex min-w-0 items-center gap-2.5 text-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">
                <Mail className="size-4" />
              </span>
              <span className="truncate">{profile.email}</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-[#EEF2F7] bg-[#FAFBFD]">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "px-3 py-4 text-center",
                index > 0 && "border-l border-[#EEF2F7]",
              )}
            >
              <p className="text-foreground text-lg font-bold leading-none">{stat.value}</p>
              <p className="text-muted-foreground mt-1.5 text-[11px] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

function DesktopOverviewTab({
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
  fromKey = "profile",
}) {
  return (
    <div className="space-y-8">
      <DesktopInlineSection title="Account">
        <ProfileMenuItem href={appendFromParam(ROUTES.SAVED, fromKey)} label="Saved" icon={ProfileSavedIcon} iconWrapClass="bg-[#FCE7F3]" />
        <ProfileMenuItem href={appendFromParam(ROUTES.ADDRESSES, fromKey)} label="My Addresses" icon={ProfileAddressesIcon} iconWrapClass="bg-[#EDE9FE]" />
        <ProfileMenuItem
          label="Notification"
          icon={ProfileNotificationIcon}
          iconWrapClass="bg-[#FEE2E2]"
          trailing={
            <ProfileToggle
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              label="Toggle notifications"
            />
          }
        />
        <ProfileMenuItem href={buildReelsRoute({ from: fromKey, view: "saved" })} label="Reels" icon={ProfileReelsIcon} iconWrapClass="bg-[#DBEAFE]" />
      </DesktopInlineSection>

      <DesktopInlineSection title="Activity">
        <ProfileMenuItem href={appendFromParam(ROUTES.WALLET, fromKey)} label="My Wallet" icon={ProfileWalletIcon} iconWrapClass="bg-[#FFE8E8]" />
        <ProfileMenuItem href={appendFromParam(ROUTES.REVIEWS, fromKey)} label="Reviews you've left" icon={ProfileReviewsIcon} iconWrapClass="bg-[#FCE7F3]" />
        <ProfileMenuItem href={appendFromParam(ROUTES.REFERRALS, fromKey)} label="Credits & referrals" icon={ProfileReferralsIcon} iconWrapClass="bg-[#DBEAFE]" />
      </DesktopInlineSection>

      <DesktopInlineSection title="Preferences">
        <ProfileMenuItem label="Languages" icon={ProfileLanguagesIcon} iconWrapClass="bg-[#EDE9FE]" onClick={() => onPlaceholder("Languages")} />
        <ProfileMenuItem label="Privacy & data" icon={ProfilePrivacyIcon} iconWrapClass="bg-[#FEE2E2]" onClick={() => onPlaceholder("Privacy & data")} />
        <ProfileMenuItem label="Terms & conditions" icon={ProfileTermsIcon} iconWrapClass="bg-[#FCE7F3]" onClick={() => onPlaceholder("Terms & conditions")} />
        <ProfileMenuItem label="Help center" icon={ProfileHelpIcon} iconWrapClass="bg-[#DBEAFE]" onClick={() => onPlaceholder("Help center")} />
      </DesktopInlineSection>

      <button
        type="button"
        onClick={onLogout}
        className="flex w-full items-center gap-3 rounded-2xl border border-[#FECDD3] bg-[#FFF1F2] px-4 py-3.5 transition-colors hover:bg-[#FFE4E6]"
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FB7185] to-[#F43F5E]">
          <ProfileLogoutIcon className="size-[22px]" />
        </div>
        <span className="text-foreground text-[15px] font-medium">Sign out</span>
      </button>
    </div>
  );
}

function ProfileMobileView({
  profile,
  stats,
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
}) {
  return (
    <>
      <header className="safe-top bg-surface-page px-4 pt-4 pb-2">
        <h1 className="text-foreground text-xl font-bold">Profile</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-5 px-4 py-2">
        <ProfileHeroCard profile={profile} stats={stats} />

        <ProfileSection title="Account">
          <ProfileMenuItem href={appendFromParam(ROUTES.SAVED, "profile")} label="Saved" icon={ProfileSavedIcon} iconWrapClass="bg-[#FCE7F3]" />
          <ProfileMenuItem href={appendFromParam(ROUTES.ADDRESSES, "profile")} label="My Addresses" icon={ProfileAddressesIcon} iconWrapClass="bg-[#EDE9FE]" />
          <ProfileMenuItem
            label="Notification"
            icon={ProfileNotificationIcon}
            iconWrapClass="bg-[#FEE2E2]"
            trailing={
              <ProfileToggle
                checked={notificationsEnabled}
                onChange={setNotificationsEnabled}
                label="Toggle notifications"
              />
            }
          />
          <ProfileMenuItem href={buildReelsRoute({ from: "profile", view: "saved" })} label="Reels" icon={ProfileReelsIcon} iconWrapClass="bg-[#DBEAFE]" />
        </ProfileSection>

        <ProfileSection title="Activity">
          <ProfileMenuItem href={appendFromParam(ROUTES.WALLET, "profile")} label="My Wallet" icon={ProfileWalletIcon} iconWrapClass="bg-[#FFE8E8]" />
          <ProfileMenuItem href={appendFromParam(ROUTES.REVIEWS, "profile")} label="Reviews you've left" icon={ProfileReviewsIcon} iconWrapClass="bg-[#FCE7F3]" />
          <ProfileMenuItem href={appendFromParam(ROUTES.REFERRALS, "profile")} label="Credits & referrals" icon={ProfileReferralsIcon} iconWrapClass="bg-[#DBEAFE]" />
        </ProfileSection>

        <ProfileSection title="Preferences">
          <ProfileMenuItem label="Languages" icon={ProfileLanguagesIcon} iconWrapClass="bg-[#EDE9FE]" onClick={() => onPlaceholder("Languages")} />
          <ProfileMenuItem label="Privacy & data" icon={ProfilePrivacyIcon} iconWrapClass="bg-[#FEE2E2]" onClick={() => onPlaceholder("Privacy & data")} />
          <ProfileMenuItem label="Terms & conditions" icon={ProfileTermsIcon} iconWrapClass="bg-[#FCE7F3]" onClick={() => onPlaceholder("Terms & conditions")} />
          <ProfileMenuItem label="Help center" icon={ProfileHelpIcon} iconWrapClass="bg-[#DBEAFE]" onClick={() => onPlaceholder("Help center")} />
        </ProfileSection>

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-2xl bg-[#FFF1F2] px-4 py-3.5 transition-colors hover:bg-[#FFE4E6]"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#FB7185] to-[#F43F5E]">
            <ProfileLogoutIcon className="size-[22px]" />
          </div>
          <span className="text-foreground text-[15px] font-medium">Sign out</span>
        </button>
      </main>
    </>
  );
}

function ProfileDesktopView({
  profile,
  stats,
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
}) {
  return (
    <>
      <div className="shrink-0">
        <HomeHeader />
      </div>

      <div className="mx-auto flex w-full max-w-7xl min-h-0 flex-1 flex-col overflow-hidden px-4 pt-8 md:px-6 lg:pb-6">
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-stretch xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
          <DesktopProfileSidebar profile={profile} stats={stats} />

          <div className="min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
            <h1 className="text-foreground shrink-0 text-3xl font-bold tracking-tight">My Profile</h1>

            <div className="mt-6 flex min-h-0 flex-1 flex-col rounded-2xl bg-background shadow-card-hover lg:max-h-full">
              <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
                <DesktopOverviewTab
                  notificationsEnabled={notificationsEnabled}
                  setNotificationsEnabled={setNotificationsEnabled}
                  onLogout={onLogout}
                  onPlaceholder={onPlaceholder}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ProfileView() {
  const { profile } = useUserProfileStore();
  const { logout } = useUserAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    profile.preferences?.notifications ?? true,
  );

  useEffect(() => {
    setBackFromSource("profile");
  }, []);

  const stats = useMemo(() => {
    const userAppointments = appointments.filter((item) => item.userId === profile.id);
    const totalExpenses = userAppointments.reduce((sum, item) => sum + (item.amount || 0), 0);
    const reviewCount = reviews.filter((item) => item.userId === profile.id).length;

    return [
      { value: profile.totalBookings ?? userAppointments.length, label: "Bookings" },
      {
        value: totalExpenses > 0 ? totalExpenses.toLocaleString("en-IN") : "1000",
        label: "Expenses",
      },
      { value: reviewCount || 12, label: "Review" },
    ];
  }, [profile.id, profile.totalBookings]);

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out successfully");
    window.location.href = ROUTES.USER_LOGIN;
  };

  const handlePlaceholder = (label) => {
    toast.message(`${label} coming soon`);
  };

  return (
    <div className="bg-surface-page min-h-dvh pb-24 md:flex md:h-dvh md:flex-col md:overflow-hidden md:pb-0">
      <div className="md:hidden">
        <ProfileMobileView
          profile={profile}
          stats={stats}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          onLogout={handleLogout}
          onPlaceholder={handlePlaceholder}
        />
      </div>

      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        <ProfileDesktopView
          profile={profile}
          stats={stats}
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          onLogout={handleLogout}
          onPlaceholder={handlePlaceholder}
        />
      </div>

      <UserBottomNav />
    </div>
  );
}
