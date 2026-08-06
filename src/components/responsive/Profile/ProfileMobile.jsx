"use client";

import { UserBottomNav } from "@/components/layout/user-nav";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

import { ProfileHeroCard, ProfileOverviewContent } from "./profile-parts";

export function ProfileMobile({
  profile,
  stats,
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
}) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "bg-surface-page pb-24")}>
      <header className="safe-top bg-surface-page px-4 pt-4 pb-2">
        <h1 className="text-foreground text-xl font-bold">Profile</h1>
      </header>

      <main className={cn(PAGE_CONTAINER_VARIANTS.browse, "space-y-5 py-2")}>
        <ProfileHeroCard profile={profile} stats={stats} />
        <ProfileOverviewContent
          notificationsEnabled={notificationsEnabled}
          setNotificationsEnabled={setNotificationsEnabled}
          onLogout={onLogout}
          onPlaceholder={onPlaceholder}
        />
      </main>

      <UserBottomNav />
    </div>
  );
}
