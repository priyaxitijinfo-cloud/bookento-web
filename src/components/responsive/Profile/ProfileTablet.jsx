"use client";

import { UserBottomNav } from "@/components/layout/user-nav";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";

import { ProfileHeroCard, ProfileOverviewContent } from "./profile-parts";

export function ProfileTablet({
  profile,
  stats,
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
}) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "bg-surface-page pb-24")}>
      <header className="safe-top bg-surface-page px-6 pt-5 pb-3">
        <h1 className="text-foreground text-2xl font-bold">Profile</h1>
      </header>

      <main className={cn(PAGE_CONTAINER_VARIANTS.browse, "mx-auto max-w-2xl space-y-6 py-3")}>
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
