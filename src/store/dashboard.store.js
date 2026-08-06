import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { providerDashboard, userDashboard } from "@/mock/dashboard";
import { earningsSummary } from "@/mock/earnings";
import { analytics } from "@/mock/analytics";
import { delay } from "@/mock/helpers";

export const useDashboardStore = create(
  devtools(
    (set) => ({
      userDashboard: null,
      providerDashboard: null,
      earnings: null,
      analytics: null,
      isLoading: false,

      fetchUserDashboard: async () => {
        set({ isLoading: true });
        await delay(400);
        set({ userDashboard, isLoading: false });
        return userDashboard;
      },

      fetchProviderDashboard: async () => {
        set({ isLoading: true });
        await delay(400);
        set({ providerDashboard, earnings: earningsSummary, isLoading: false });
        return providerDashboard;
      },

      fetchAnalytics: async () => {
        set({ isLoading: true });
        await delay(400);
        set({ analytics, isLoading: false });
        return analytics;
      },
    }),
    { name: "DashboardStore" },
  ),
);
