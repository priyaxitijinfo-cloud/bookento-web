import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { reels } from "@/mock/reels";

import { createPersistOptions } from "./persist-storage";

export const DEFAULT_SAVED_REEL_IDS = reels.slice(0, 20).map((reel) => reel.id);

export const useSavedReelsStore = create(
  devtools(
    persist(
      (set, get) => ({
        savedIds: DEFAULT_SAVED_REEL_IDS,

        isSaved: (reelId) => get().savedIds.includes(reelId),

        toggleSaved: (reelId) => {
          const wasSaved = get().savedIds.includes(reelId);

          set({
            savedIds: wasSaved
              ? get().savedIds.filter((id) => id !== reelId)
              : [...get().savedIds, reelId],
          });

          return !wasSaved;
        },
      }),
      createPersistOptions({
        name: "bookento-saved-reels",
        version: 2,
        partialize: (state) => ({ savedIds: state.savedIds }),
        migrate: (persistedState, version) => {
          const savedIds = persistedState?.savedIds;

          if (!Array.isArray(savedIds) || savedIds.length === 0 || version < 2) {
            return { savedIds: DEFAULT_SAVED_REEL_IDS };
          }

          return { savedIds };
        },
        onRehydrateStorage: () => (state, error) => {
          if (error || !state) return;

          if (!state.savedIds?.length) {
            state.savedIds = DEFAULT_SAVED_REEL_IDS;
          }
        },
      }),
    ),
    { name: "SavedReelsStore" },
  ),
);
