import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

export const CATEGORY_SUGGESTION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const DESC =
  "Dr. Amara Reyes is a highly experienced and board-certified gynecologist with over 10 years of experience providing comprehensive women's health care.";

export const SAMPLE_CATEGORY_SUGGESTIONS = [
  {
    id: "pcs_pending_1",
    name: "Neurology",
    description: DESC,
    icon: "/icons/categories/service/neurology.png",
    status: CATEGORY_SUGGESTION_STATUS.PENDING,
    statusAt: "2025-07-13T10:30:00",
  },
  {
    id: "pcs_pending_2",
    name: "Sports Medicine",
    description: DESC,
    icon: "/icons/categories/service/orthopedics.png",
    status: CATEGORY_SUGGESTION_STATUS.PENDING,
    statusAt: "2025-07-13T10:30:00",
  },
  {
    id: "pcs_pending_3",
    name: "Occupational Therapy",
    description: DESC,
    icon: "/icons/categories/service/diabetes.png",
    status: CATEGORY_SUGGESTION_STATUS.PENDING,
    statusAt: "2025-07-13T10:30:00",
  },
  {
    id: "pcs_approved_1",
    name: "Cardiology",
    description: DESC,
    icon: "/icons/categories/service/cardiology.png",
    status: CATEGORY_SUGGESTION_STATUS.APPROVED,
    statusAt: "2025-07-10T14:15:00",
  },
  {
    id: "pcs_approved_2",
    name: "Dermatology",
    description: DESC,
    icon: "/icons/categories/service/pulmonology.png",
    status: CATEGORY_SUGGESTION_STATUS.APPROVED,
    statusAt: "2025-07-10T14:15:00",
  },
  {
    id: "pcs_approved_3",
    name: "Gastroenterology",
    description: DESC,
    icon: "/icons/categories/service/diabetes.png",
    status: CATEGORY_SUGGESTION_STATUS.APPROVED,
    statusAt: "2025-07-10T14:15:00",
  },
  {
    id: "pcs_rejected_1",
    name: "General Physician",
    description: DESC,
    icon: "/icons/categories/service/eye.png",
    status: CATEGORY_SUGGESTION_STATUS.REJECTED,
    statusAt: "2025-07-08T11:20:00",
  },
  {
    id: "pcs_rejected_2",
    name: "Cosmetic Surgery",
    description: DESC,
    icon: "/icons/categories/service/dental.png",
    status: CATEGORY_SUGGESTION_STATUS.REJECTED,
    statusAt: "2025-07-08T11:20:00",
  },
  {
    id: "pcs_rejected_3",
    name: "Home Nursing Care",
    description: DESC,
    icon: "/icons/categories/service/neurology.png",
    status: CATEGORY_SUGGESTION_STATUS.REJECTED,
    statusAt: "2025-07-08T11:20:00",
  },
];

const PLACEHOLDER_ICON = "/icons/categories/service/general-physician.png";

function createId() {
  return `pcs_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export const useProviderCategorySuggestionsStore = create(
  devtools(
    persist(
      (set, get) => ({
        suggestions: SAMPLE_CATEGORY_SUGGESTIONS,

        getByStatus: (status) =>
          get().suggestions.filter((item) => item.status === status),

        addSuggestion: ({ name, description, icon }) => {
          const suggestion = {
            id: createId(),
            name: (name || "").trim() || "New Category",
            description: (description || "").trim(),
            icon: icon || PLACEHOLDER_ICON,
            status: CATEGORY_SUGGESTION_STATUS.PENDING,
            statusAt: new Date().toISOString(),
          };
          set((state) => ({
            suggestions: [suggestion, ...state.suggestions],
          }));
          return suggestion;
        },

        removeSuggestion: (id) => {
          set((state) => ({
            suggestions: state.suggestions.filter((item) => item.id !== id),
          }));
        },

        resetToSample: () => set({ suggestions: SAMPLE_CATEGORY_SUGGESTIONS }),
      }),
      createPersistOptions({ name: "bookento-provider-category-suggestions" }),
    ),
    { name: "ProviderCategorySuggestionsStore" },
  ),
);
