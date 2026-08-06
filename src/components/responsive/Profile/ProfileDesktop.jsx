"use client";

import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";

import {
  DesktopProfileSidebar,
  ProfileOverviewContent,
} from "./profile-parts";

export function ProfileDesktop({
  profile,
  stats,
  notificationsEnabled,
  setNotificationsEnabled,
  onLogout,
  onPlaceholder,
}) {
  return (
    <DesktopLayout maxWidth="wide" contentClassName="!py-0">
      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start xl:grid-cols-[320px_minmax(0,1fr)] xl:gap-10">
        <DesktopProfileSidebar profile={profile} stats={stats} />

        <div className="min-w-0">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">My Profile</h1>
          <ResponsiveCard className="mt-6 overflow-hidden !p-0">
            <div className="scrollbar-hide max-h-[calc(100dvh-12rem)] overflow-y-auto p-6 sm:p-8">
              <ProfileOverviewContent
                notificationsEnabled={notificationsEnabled}
                setNotificationsEnabled={setNotificationsEnabled}
                onLogout={onLogout}
                onPlaceholder={onPlaceholder}
                variant="desktop"
              />
            </div>
          </ResponsiveCard>
        </div>
      </div>
    </DesktopLayout>
  );
}
