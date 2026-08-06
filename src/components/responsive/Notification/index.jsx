"use client";

import { useMemo, useState } from "react";
import { isToday, isYesterday, parseISO, isValid } from "date-fns";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { useNotificationStore } from "@/store";

import { NotificationDesktop } from "./NotificationDesktop";
import { NotificationMobile } from "./NotificationMobile";
import { NotificationTablet } from "./NotificationTablet";

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

export function NotificationResponsive() {
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

  const viewProps = { filter, onFilterChange: setFilter, grouped, onRead: markAsRead };

  return (
    <ResponsiveView
      mobile={<NotificationMobile {...viewProps} />}
      tablet={<NotificationTablet {...viewProps} />}
      desktop={<NotificationDesktop {...viewProps} />}
    />
  );
}

export default NotificationResponsive;
