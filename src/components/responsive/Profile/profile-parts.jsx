"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ChevronRight, Mail, Pencil } from "lucide-react";
import { toast } from "sonner";

import {
  ProfileAddressesIcon,
  ProfileChatsIcon,
  ProfileEditIcon,
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
import { Avatar } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes.constants";
import { appendFromParam, buildReelsRoute } from "@/lib/navigation/back-navigation";
import { cn } from "@/lib/utils";
import { useUserProfileStore } from "@/store";

export function ProfileToggle({ checked, onChange, label }) {
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
          "bg-background absolute top-0.5 left-0.5 size-5 rounded-full shadow-sm transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

export function ProfileSection({ title, children }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2 max-md:gap-0">
        <span className="section-title-bar max-md:mr-1.5" aria-hidden />
        <h2 className="text-foreground text-base font-semibold md:font-bold">
          {title}
        </h2>
      </div>
      <div className="divide-border/60 bg-background shadow-card divide-y overflow-hidden rounded-2xl">
        {children}
      </div>
    </section>
  );
}

export function ProfileMenuItem({
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
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          iconWrapClass,
        )}
      >
        <Icon className={cn("size-[22px]", iconClass)} />
      </div>
      <span className="text-foreground min-w-0 flex-1 text-left text-[15px] font-medium">
        {label}
      </span>
      {trailing ?? (
        <ChevronRight
          className="text-muted-foreground size-5 shrink-0"
          strokeWidth={2}
        />
      )}
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

export function ProfileHeroCard({ profile, stats }) {
  const router = useRouter();

  const handleEditProfile = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches
    ) {
      router.push(ROUTES.PROFILE_EDIT);
      return;
    }
    toast.message("Edit profile coming soon");
  };

  return (
    <div className="gradient-brand relative overflow-hidden rounded-2xl p-4 shadow-[0_8px_24px_rgba(24,101,234,0.22)]">
      <div className="flex items-start gap-3">
        <Avatar
          src={profile.avatar}
          name={profile.name}
          size="lg"
          className="ring-2 ring-white/30"
        />
        <div className="min-w-0 flex-1 pt-0.5">
          <h2 className="truncate text-lg font-bold text-white">{profile.name}</h2>
          <p className="truncate text-sm text-white/85">{profile.email}</p>
        </div>
        <button
          type="button"
          onClick={handleEditProfile}
          className="bg-background/20 hover:bg-background/30 flex size-9 shrink-0 items-center justify-center rounded-md border border-[#FFFFFF] text-white transition-colors md:rounded-full md:border-0"
          aria-label="Edit profile"
        >
          <ProfileEditIcon className="size-[18px] md:hidden" />
          <Pencil className="hidden size-4 md:block" />
        </button>
      </div>

      <div className="bg-background/15 mt-4 grid grid-cols-3 rounded-xl px-2 py-3 backdrop-blur-sm">
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

export function DesktopInlineSection({ title, children }) {
  return (
    <section>
      <div className="mb-4 flex items-center gap-2">
        <span className="section-title-bar" aria-hidden />
        <h2 className="text-foreground text-base font-semibold md:font-bold">
          {title}
        </h2>
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

export function DesktopProfileSidebar({ profile, stats }) {
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
      <div className="bg-background shadow-card-hover overflow-hidden rounded-2xl">
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
            className="bg-background/95 text-muted-foreground hover:text-primary absolute top-4 right-4 flex size-10 items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Edit profile photo"
          >
            <Pencil className="size-4" />
          </button>
        </div>

        <div className="bg-background border-t border-[#EEF2F7] px-5 py-5">
          <h2 className="text-foreground text-xl leading-tight font-bold">
            {profile.name}
          </h2>
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
              <p className="text-foreground text-lg leading-none font-bold">
                {stat.value}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[11px] font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function ProfileOverviewContent({
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
  fromKey = "profile",
  variant = "mobile",
}) {
  const isDesktop = variant === "desktop";
  const Section = isDesktop ? DesktopInlineSection : ProfileSection;
  const languagesHref = appendFromParam(ROUTES.LANGUAGE, fromKey);

  const accountItems = (
    <>
      <ProfileMenuItem
        href={appendFromParam(ROUTES.SAVED, fromKey)}
        label="Saved"
        icon={ProfileSavedIcon}
        iconWrapClass="bg-[#FCE7F3]"
      />
      <ProfileMenuItem
        href={appendFromParam(ROUTES.ADDRESSES, fromKey)}
        label="My Addresses"
        icon={ProfileAddressesIcon}
        iconWrapClass="bg-[#EDE9FE]"
      />
      {isDesktop ? (
        <ProfileMenuItem
          href={appendFromParam(ROUTES.CHATS, fromKey)}
          label="Chats"
          icon={ProfileChatsIcon}
          iconWrapClass="bg-[#E0F2FE]"
          iconClass="size-[18px]"
        />
      ) : null}
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
      <ProfileMenuItem
        href={buildReelsRoute({ from: fromKey, view: "saved" })}
        label="Reels"
        icon={ProfileReelsIcon}
        iconWrapClass="bg-[#DBEAFE]"
      />
    </>
  );

  const activityItems = (
    <>
      <ProfileMenuItem
        href={appendFromParam(ROUTES.WALLET, fromKey)}
        label="My Wallet"
        icon={ProfileWalletIcon}
        iconWrapClass="bg-[#FFE8E8]"
      />
      <ProfileMenuItem
        href={appendFromParam(ROUTES.REVIEWS, fromKey)}
        label="Reviews you've left"
        icon={ProfileReviewsIcon}
        iconWrapClass="bg-[#FCE7F3]"
      />
      <ProfileMenuItem
        href={appendFromParam(ROUTES.REFERRALS, fromKey)}
        label="Credits & referrals"
        icon={ProfileReferralsIcon}
        iconWrapClass="bg-[#DBEAFE]"
      />
    </>
  );

  const preferenceItems = (
    <>
      <ProfileMenuItem
        href={languagesHref}
        label="Languages"
        icon={ProfileLanguagesIcon}
        iconWrapClass="bg-[#EDE9FE]"
      />
      {isDesktop ? (
        <ProfileMenuItem
          label="Privacy & data"
          icon={ProfilePrivacyIcon}
          iconWrapClass="bg-[#FEE2E2]"
          onClick={() => onPlaceholder("Privacy & data")}
        />
      ) : (
        <ProfileMenuItem
          href={appendFromParam(ROUTES.PRIVACY, fromKey)}
          label="Privacy & data"
          icon={ProfilePrivacyIcon}
          iconWrapClass="bg-[#FEE2E2]"
        />
      )}
      {isDesktop ? (
        <ProfileMenuItem
          label="Terms & conditions"
          icon={ProfileTermsIcon}
          iconWrapClass="bg-[#FCE7F3]"
          onClick={() => onPlaceholder("Terms & conditions")}
        />
      ) : (
        <ProfileMenuItem
          href={appendFromParam(ROUTES.TERMS, fromKey)}
          label="Terms & conditions"
          icon={ProfileTermsIcon}
          iconWrapClass="bg-[#FCE7F3]"
        />
      )}
      {isDesktop ? (
        <ProfileMenuItem
          label="Help center"
          icon={ProfileHelpIcon}
          iconWrapClass="bg-[#DBEAFE]"
          onClick={() => onPlaceholder("Help center")}
        />
      ) : (
        <ProfileMenuItem
          href={appendFromParam(ROUTES.HELP, fromKey)}
          label="Help center"
          icon={ProfileHelpIcon}
          iconWrapClass="bg-[#DBEAFE]"
        />
      )}
    </>
  );

  const signOutButton = (
    <button
      type="button"
      onClick={onLogout}
      className={cn(
        "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors",
        isDesktop
          ? "border border-[#FECDD3] bg-[#FFF1F2] hover:bg-[#FFE4E6]"
          : "bg-[#FFF1F2] hover:bg-[#FFE4E6]",
      )}
    >
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
          isDesktop ? "from-[#FB7185] to-[#F43F5E]" : "from-[#FDA769] to-[#FC5B7D]",
        )}
      >
        <ProfileLogoutIcon className="size-[22px]" />
      </div>
      <span className="text-foreground text-[15px] font-medium">Sign out</span>
    </button>
  );

  return (
    <div className={isDesktop ? "space-y-8" : "space-y-5"}>
      <Section title="Account">{accountItems}</Section>
      <Section title="Activity">{activityItems}</Section>
      <Section title="Preferences">{preferenceItems}</Section>
      {signOutButton}
    </div>
  );
}
