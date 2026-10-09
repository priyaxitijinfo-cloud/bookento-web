"use client";

import { useMemo } from "react";
import Link from "next/link";
import { isToday, isValid, isYesterday, parseISO } from "date-fns";
import { ArrowLeft, Bell } from "lucide-react";

import { NotificationItem } from "@/components/notifications/notification-item";
import { ROUTES } from "@/constants/routes.constants";
import { useNotificationStore } from "@/store";

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

export function ProviderNotificationsView() {
  const { providerNotifications, markAsRead } = useNotificationStore();

  const grouped = useMemo(() => {
    const sorted = [...providerNotifications].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );
    const sections = { today: [], yesterday: [], earlier: [] };
    for (const notif of sorted) {
      sections[getDaySection(notif.createdAt)].push(notif);
    }
    return sections;
  }, [providerNotifications]);

  const hasItems = SECTION_ORDER.some((key) => grouped[key].length > 0);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-[#E8EEF8] bg-[#F4F7FF]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-2 px-4 lg:px-6">
          <Link
            href={ROUTES.PROVIDER_HOME}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#111827] transition-colors hover:bg-white/80"
            aria-label="Back"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="flex-1 truncate pr-10 text-center text-lg font-bold text-[#111827]">
            Notification
          </h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#F4F7FF]">
        <div className="mx-auto w-full max-w-3xl pb-6 lg:px-6 lg:pt-2">
          {!hasItems ? (
            <div className="px-4 pt-12 text-center">
              <div className="bg-card mx-auto mb-3 flex size-14 items-center justify-center rounded-full">
                <Bell className="text-muted-foreground size-6" />
              </div>
              <p className="font-semibold text-[#111827]">No notifications</p>
              <p className="text-muted-foreground mt-1 text-sm">
                You&apos;re all caught up!
              </p>
            </div>
          ) : (
            <div className="overflow-hidden bg-white lg:mt-2 lg:rounded-2xl lg:border lg:border-[#EEF2F7] lg:shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
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
                          <NotificationItem
                            notification={notif}
                            onRead={(id) => markAsRead(id, "provider")}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
