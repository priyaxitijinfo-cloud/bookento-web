"use client";

import Link from "next/link";
import {
  Bell, Calendar, CreditCard, MessageCircle, Star, Settings,
} from "lucide-react";

import { ProviderHeader } from "@/components/layout/provider-nav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNotificationStore } from "@/store";
import { formatRelativeTime } from "@/utils/format.utils";

const typeIcons = {
  booking: Calendar,
  payment: CreditCard,
  chat: MessageCircle,
  review: Star,
  system: Settings,
};

export default function ProviderNotificationsPage() {
  const { providerNotifications, markAsRead, markAllRead, unreadCount } = useNotificationStore();
  const unread = unreadCount("provider");

  return (
    <>
      <ProviderHeader title="Notifications" />
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-primary size-5" />
            <span className="text-muted-foreground text-sm">
              {unread} unread notification{unread !== 1 ? "s" : ""}
            </span>
          </div>
          {unread > 0 && (
            <Button variant="outline" size="sm" onClick={() => markAllRead("provider")}>
              Mark all read
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {providerNotifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;
            return (
              <Card
                key={notif.id}
                className={`transition-colors ${!notif.isRead ? "border-primary/30 bg-primary/5" : ""}`}
              >
                <CardContent className="flex gap-4 p-4">
                  <div className={`rounded-xl p-2.5 ${!notif.isRead ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{notif.title}</p>
                        <p className="text-muted-foreground mt-0.5 text-sm">{notif.message}</p>
                      </div>
                      {!notif.isRead && <Badge variant="default">New</Badge>}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-muted-foreground text-xs">{formatRelativeTime(notif.createdAt)}</span>
                      {notif.actionUrl && (
                        <Link
                          href={notif.actionUrl}
                          className="text-primary text-xs font-medium hover:underline"
                          onClick={() => markAsRead(notif.id, "provider")}
                        >
                          View details
                        </Link>
                      )}
                      {!notif.isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notif.id, "provider")}
                          className="text-muted-foreground text-xs hover:underline"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
