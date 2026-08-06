import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { mockProviders } from "@/mock/providers";
import { delay } from "@/mock/helpers";

export const useProviderStore = create(
  devtools(
    (set, get) => ({
      providers: mockProviders,
      selectedProvider: null,
      recentlyViewed: [],
      isLoading: false,

      fetchProviders: async (filters = {}) => {
        set({ isLoading: true });
        await delay(500);
        let list = [...mockProviders];
        if (filters.search) {
          const q = filters.search.toLowerCase();
          list = list.filter(
            (p) =>
              p.businessName.toLowerCase().includes(q) ||
              p.specialty.toLowerCase().includes(q),
          );
        }
        if (filters.categoryId) {
          list = list.filter((p) => p.categoryId === filters.categoryId);
        }
        set({ providers: list, isLoading: false });
        return list;
      },

      getProvider: (id) => mockProviders.find((p) => p.id === id),

      setSelectedProvider: (provider) => {
        set({ selectedProvider: provider });
        if (provider) {
          const viewed = get().recentlyViewed.filter((p) => p.id !== provider.id);
          set({ recentlyViewed: [provider, ...viewed].slice(0, 10) });
        }
      },
    }),
    { name: "ProviderStore" },
  ),
);
