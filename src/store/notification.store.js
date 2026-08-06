import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { notifications, providerNotifications } from "@/mock/notifications";
import { delay } from "@/mock/helpers";

export const useNotificationStore = create(
  devtools(
    (set, get) => ({
      notifications,
      providerNotifications,
      isLoading: false,

      fetchNotifications: async (role = "user") => {
        set({ isLoading: true });
        await delay(300);
        set({ isLoading: false });
        return role === "provider" ? get().providerNotifications : get().notifications;
      },

      markAsRead: (id, role = "user") => {
        const key = role === "provider" ? "providerNotifications" : "notifications";
        set((s) => ({
          [key]: s[key].map((n) => (n.id === id ? { ...n, isRead: true } : n)),
        }));
      },

      markAllRead: (role = "user") => {
        const key = role === "provider" ? "providerNotifications" : "notifications";
        set((s) => ({
          [key]: s[key].map((n) => ({ ...n, isRead: true })),
        }));
      },

      unreadCount: (role = "user") => {
        const list = role === "provider" ? get().providerNotifications : get().notifications;
        return list.filter((n) => !n.isRead).length;
      },
    }),
    { name: "NotificationStore" },
  ),
);
