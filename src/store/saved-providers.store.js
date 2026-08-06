import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { savedProviders } from "@/mock/users";

import { createPersistOptions } from "./persist-storage";

export const DEFAULT_SAVED_PROVIDER_IDS = savedProviders.map((saved) => saved.providerId);

export const useSavedProvidersStore = create(
  devtools(
    persist(
      (set, get) => ({
        savedIds: DEFAULT_SAVED_PROVIDER_IDS,

        isSaved: (providerId) => get().savedIds.includes(providerId),

        toggleSaved: (providerId) => {
          const wasSaved = get().savedIds.includes(providerId);

          set({
            savedIds: wasSaved
              ? get().savedIds.filter((id) => id !== providerId)
              : [...get().savedIds, providerId],
          });

          return !wasSaved;
        },
      }),
      createPersistOptions({
        name: "bookento-saved-providers",
        version: 2,
        partialize: (state) => ({ savedIds: state.savedIds }),
        migrate: (persistedState) => {
          const savedIds = persistedState?.savedIds;

          if (!Array.isArray(savedIds) || savedIds.length === 0) {
            return { savedIds: DEFAULT_SAVED_PROVIDER_IDS };
          }

          return { savedIds };
        },
        onRehydrateStorage: () => (state, error) => {
          if (error || !state) return;

          if (!state.savedIds?.length) {
            state.savedIds = DEFAULT_SAVED_PROVIDER_IDS;
          }
        },
      }),
    ),
    { name: "SavedProvidersStore" },
  ),
);
