"use client";

import { useMemo, useState } from "react";
import { isToday, isYesterday, parseISO, isValid } from "date-fns";
import { Bell } from "lucide-react";

import { NotificationFilterTabs } from "@/components/notifications/notification-filter-tabs";
import { NotificationItem } from "@/components/notifications/notification-item";
import { UserPageShell } from "@/components/layout/user-page-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ROUTES } from "@/constants/routes.constants";
import { useNotificationStore } from "@/store";

const FILTER_TYPES = {
  all: null,
  booking: "booking",
  chat: "chat",
  promo: "promo",
};

function getDaySection(date) {
  const parsed = typeof date === "string" ? parseISO(date) : date;
  if (!isValid(parsed)) return "earlier";
  if (isToday(parsed)) return "today";
  if (isYesterday(parsed)) return "yesterday";
  return "earlier";
}

const SECTION_LABELS = {
  today: "TODAY",
  yesterday: "YESTERDAY",
  earlier: "EARLIER",
};

const SECTION_ORDER = ["today", "yesterday", "earlier"];

export default function NotificationsPage() {
  const { notifications, markAsRead } = useNotificationStore();
  const [filter, setFilter] = useState("all");

  const grouped = useMemo(() => {
    const type = FILTER_TYPES[filter];
    const filtered = notifications
      .filter((notif) => (type ? notif.type === type : true))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const sections = { today: [], yesterday: [], earlier: [] };
    for (const notif of filtered) {
      sections[getDaySection(notif.createdAt)].push(notif);
    }
    return sections;
  }, [notifications, filter]);

  const hasItems = SECTION_ORDER.some((key) => grouped[key].length > 0);

  return (
    <UserPageShell
      title="Notification"
      backHref={ROUTES.HOME}
      backLabel="Back to Home"
      showBottomNav={false}
      containerVariant="browseWithBreadcrumb"
      className="bg-surface-page md:bg-surface-page"
      mainClassName="max-md:!px-0 max-md:pt-0 pb-6 md:px-6 md:pt-2 md:-mt-[10px]"
    >
      <div>
        <div className="pt-4 pb-2 md:px-1 md:pt-4 md:pb-3">
          <NotificationFilterTabs value={filter} onChange={setFilter} />
        </div>

        {!hasItems ? (
          <div className="px-4 pt-8 md:px-5 md:pb-8">
            <EmptyState
              icon={Bell}
              title="No notifications"
              description="You're all caught up!"
            />
          </div>
        ) : (
          <div>
            {SECTION_ORDER.map((key) => {
              const items = grouped[key];
              if (!items.length) return null;

              return (
                <section key={key}>
                  <h2 className="text-muted-foreground px-4 pt-4 pb-1 text-[11px] font-semibold tracking-wider uppercase md:px-5 md:pt-5 md:text-xs">
                    {SECTION_LABELS[key]}
                  </h2>
                  <ul>
                    {items.map((notif) => (
                      <li key={notif.id}>
                        <NotificationItem notification={notif} onRead={markAsRead} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </UserPageShell>
  );
}
