import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { userSettings } from "@/mock/settings";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

export const useSettingsStore = create(
  devtools(
    persist(
      (set) => ({
        userSettings,
        isLoading: false,

        updateUserSettings: async (data) => {
          set({ isLoading: true });
          await delay(400);
          set((s) => ({
            userSettings: { ...s.userSettings, ...data },
            isLoading: false,
          }));
        },
      }),
      createPersistOptions({ name: "bookento-user-settings" }),
    ),
    { name: "SettingsStore" },
  ),
);
