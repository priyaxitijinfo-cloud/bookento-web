import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

export const DEFAULT_RECENT_SEARCHES = [
  "Haircut near me",
  "Dr. Morita",
  "Saffron & Stone",
  "Deep tissue massage",
];

const MAX_RECENT = 10;

export const useRecentSearchesStore = create(
  devtools(
    persist(
      (set, get) => ({
        searches: DEFAULT_RECENT_SEARCHES,

        addSearch: (term) => {
          const trimmed = term?.trim();
          if (!trimmed) return;

          const current = get().searches.filter(
            (item) => item.toLowerCase() !== trimmed.toLowerCase(),
          );

          set({ searches: [trimmed, ...current].slice(0, MAX_RECENT) });
        },

        removeSearch: (term) => {
          set({
            searches: get().searches.filter((item) => item !== term),
          });
        },

        clearSearches: () => set({ searches: [] }),
      }),
      createPersistOptions({
        name: "bookento-recent-searches",
        version: 1,
        partialize: (state) => ({ searches: state.searches }),
        migrate: (persistedState) => {
          const searches = persistedState?.searches;

          if (!Array.isArray(searches) || searches.length === 0) {
            return { searches: DEFAULT_RECENT_SEARCHES };
          }

          return { searches };
        },
        onRehydrateStorage: () => (state, error) => {
          if (error) {
            console.error("Failed to rehydrate recent searches store", error);
          }
        },
      }),
    ),
    { name: "RecentSearchesStore" },
  ),
);
