import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { currentProvider } from "@/mock/providers";
import { providerSettings } from "@/mock/settings";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

export const useProviderProfileStore = create(
  devtools(
    persist(
      (set) => ({
        profile: currentProvider,
        isLoading: false,

        updateProfile: async (data) => {
          set({ isLoading: true });
          await delay(600);
          set((s) => ({ profile: { ...s.profile, ...data }, isLoading: false }));
          return { success: true };
        },
      }),
      createPersistOptions({ name: "bookento-provider-profile" }),
    ),
    { name: "ProviderProfileStore" },
  ),
);

export const useProviderSettingsStore = create(
  devtools(
    persist(
      (set) => ({
        settings: providerSettings,
        isLoading: false,

        updateSettings: async (data) => {
          set({ isLoading: true });
          await delay(400);
          set((s) => ({
            settings: { ...s.settings, ...data },
            isLoading: false,
          }));
        },
      }),
      createPersistOptions({ name: "bookento-provider-settings" }),
    ),
    { name: "ProviderSettingsStore" },
  ),
);
