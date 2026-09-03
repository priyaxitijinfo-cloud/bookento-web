"use client";

import { Bell } from "lucide-react";

import { NotificationFilterTabs } from "@/components/notifications/notification-filter-tabs";
import { NotificationItem } from "@/components/notifications/notification-item";
import { UserHeader } from "@/components/layout/user-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
import {
  PAGE_CONTAINER_VARIANTS,
  PAGE_SHELL_CLASS,
} from "@/lib/layout/page-layout.constants";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes.constants";

const SECTION_LABELS = {
  today: "TODAY",
  yesterday: "YESTERDAY",
  earlier: "EARLIER",
};

const SECTION_ORDER = ["today", "yesterday", "earlier"];

function NotificationList({ grouped, onRead }) {
  const hasItems = SECTION_ORDER.some((key) => grouped[key].length > 0);

  if (!hasItems) {
    return (
      <div className="px-5 pt-8 pb-8">
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You're all caught up!"
        />
      </div>
    );
  }

  return (
    <div>
      {SECTION_ORDER.map((key) => {
        const items = grouped[key];
        if (!items.length) return null;

        return (
          <section key={key}>
            <h2 className="text-muted-foreground px-5 pt-5 pb-1 text-xs font-semibold tracking-wider uppercase">
              {SECTION_LABELS[key]}
            </h2>
            <ul>
              {items.map((notif) => (
                <li key={notif.id}>
                  <NotificationItem notification={notif} onRead={onRead} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function NotificationTablet({ filter, onFilterChange, grouped, onRead }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "bg-surface-page md:bg-surface-page pb-8")}>
      <UserHeader title="Notification" backHref={ROUTES.HOME} hideActions />
      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "px-6 pt-3")}>
        <ResponsiveCard className="overflow-hidden !p-0">
          <div className="px-1 pt-4 pb-3">
            <NotificationFilterTabs value={filter} onChange={onFilterChange} />
          </div>
          <NotificationList grouped={grouped} onRead={onRead} />
        </ResponsiveCard>
      </main>
    </div>
  );
}
