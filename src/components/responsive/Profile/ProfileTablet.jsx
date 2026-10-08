"use client";

import { HomeFooter } from "@/components/home/home-footer";
import { HomeHeader } from "@/components/home/home-header";
import { UserBottomNav } from "@/components/layout/user-nav";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
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
    <div
      className={cn(
        PAGE_SHELL_CLASS,
        "bg-surface-page flex h-dvh flex-col overflow-hidden pb-24 md:pb-0",
      )}
    >
      <div className="z-30 shrink-0">
        <HomeHeader embedded />
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <header className="safe-top bg-surface-page px-6 pt-5 pb-3 md:pt-6">
          <h1 className="text-foreground text-2xl font-bold">Profile</h1>
        </header>

        <main
          className={cn(
            PAGE_CONTAINER_VARIANTS.browse,
            "mx-auto max-w-2xl space-y-6 py-3",
          )}
        >
          <ProfileHeroCard profile={profile} stats={stats} />
          <ProfileOverviewContent
            notificationsEnabled={notificationsEnabled}
            setNotificationsEnabled={setNotificationsEnabled}
            onLogout={onLogout}
            onPlaceholder={onPlaceholder}
          />
        </main>

        <div className="hidden md:block">
          <HomeFooter className="mt-0 md:mt-10" />
        </div>
      </div>

      <div className="shrink-0 md:hidden">
        <UserBottomNav />
      </div>
    </div>
  );
}
