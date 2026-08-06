"use client";

import { Bell } from "lucide-react";

import { NotificationFilterTabs } from "@/components/notifications/notification-filter-tabs";
import { NotificationItem } from "@/components/notifications/notification-item";
import { UserHeader } from "@/components/layout/user-nav";
import { EmptyState } from "@/components/shared/empty-state";
import { PAGE_CONTAINER_VARIANTS, PAGE_SHELL_CLASS } from "@/lib/layout/page-layout.constants";
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
      <div className="px-4 pt-8">
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
            <h2 className="text-muted-foreground px-4 pt-4 pb-1 text-[11px] font-semibold tracking-wider uppercase">
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

export function NotificationMobile({ filter, onFilterChange, grouped, onRead }) {
  return (
    <div className={cn(PAGE_SHELL_CLASS, "mobile-page-bg bg-surface-page")}>
      <UserHeader
        title="Notification"
        backHref={ROUTES.HOME}
        hideActions
        className="mobile-page-bg border-transparent bg-transparent"
      />
      <main className={cn(PAGE_CONTAINER_VARIANTS.browseWithBreadcrumb, "px-0 pt-0 pb-6")}>
        <div className="pt-3 pb-2">
          <NotificationFilterTabs value={filter} onChange={onFilterChange} />
        </div>
        <NotificationList grouped={grouped} onRead={onRead} />
      </main>
    </div>
  );
}
