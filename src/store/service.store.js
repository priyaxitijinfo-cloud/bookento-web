import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { services as mockServices } from "@/mock/services";
import { delay } from "@/mock/helpers";

export const useServiceStore = create(
  devtools(
    (set, get) => ({
      services: mockServices,
      isLoading: false,

      fetchServices: async (providerId) => {
        set({ isLoading: true });
        await delay(400);
        const list = providerId
          ? mockServices.filter((s) => s.providerId === providerId)
          : mockServices;
        set({ services: list, isLoading: false });
        return list;
      },
    }),
    { name: "ServiceStore" },
  ),
);

export const usePackageStore = create(
  devtools(
    (set) => ({
      packages: [],
      isLoading: false,

      fetchPackages: async (providerId) => {
        set({ isLoading: true });
        await delay(400);
        const { packages } = await import("@/mock/packages");
        const list = providerId
          ? packages.filter((p) => p.providerId === providerId)
          : packages;
        set({ packages: list, isLoading: false });
        return list;
      },
    }),
    { name: "PackageStore" },
  ),
);
