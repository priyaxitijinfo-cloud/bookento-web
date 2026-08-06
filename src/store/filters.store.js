import { create } from "zustand";
import { devtools } from "zustand/middleware";

const defaultFilters = {
  providerSearch: "",
  categoryFilter: null,
  visitTypeFilter: null,
  priceRange: null,
  sortBy: "relevance",
  appointmentTab: "confirm",
  chatFilter: "all",
};

export const useFilterStore = create(
  devtools(
    (set) => ({
      ...defaultFilters,
      setProviderSearch: (search) => set({ providerSearch: search }),
      setCategoryFilter: (category) => set({ categoryFilter: category }),
      setVisitTypeFilter: (type) => set({ visitTypeFilter: type }),
      setPriceRange: (range) => set({ priceRange: range }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setAppointmentTab: (tab) => set({ appointmentTab: tab }),
      setChatFilter: (filter) => set({ chatFilter: filter }),
      resetFilters: () => set(defaultFilters),
    }),
    { name: "FilterStore" },
  ),
);
