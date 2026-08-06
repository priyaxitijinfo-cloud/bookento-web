"use client";

import { Bell } from "lucide-react";

import { NotificationFilterTabs } from "@/components/notifications/notification-filter-tabs";
import { NotificationItem } from "@/components/notifications/notification-item";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import { EmptyState } from "@/components/shared/empty-state";
import { DesktopLayout } from "@/components/responsive/layout";
import { ResponsiveCard } from "@/components/responsive/layout/ResponsiveCard";
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
      <div className="px-5 pb-8 pt-8">
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up!" />
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

export function NotificationDesktop({ filter, onFilterChange, grouped, onRead }) {
  return (
    <DesktopLayout
      maxWidth="narrow"
      header={(
        <DesktopBreadcrumbBar
          backHref={ROUTES.HOME}
          backLabel="Back to Home"
          currentLabel="Notification"
        />
      )}
    >
      <ResponsiveCard className="overflow-hidden !p-0">
        <div className="border-b border-border px-5 py-4">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
        </div>
        <div className="px-1 pt-4 pb-3">
          <NotificationFilterTabs value={filter} onChange={onFilterChange} />
        </div>
        <NotificationList grouped={grouped} onRead={onRead} />
      </ResponsiveCard>
    </DesktopLayout>
  );
}
