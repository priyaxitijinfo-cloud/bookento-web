import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { createPersistOptions } from "./persist-storage";

export const useThemeStore = create(
  devtools(
    persist(
      (set) => ({
        theme: "system",
        setTheme: (theme) => set({ theme }),
      }),
      createPersistOptions({ name: "bookento-theme", partialize: (s) => ({ theme: s.theme }) }),
    ),
    { name: "ThemeStore" },
  ),
);

export const useModalStore = create(
  devtools(
    (set) => ({
      activeModal: null,
      modalData: null,
      openModal: (id, data = null) => set({ activeModal: id, modalData: data }),
      closeModal: () => set({ activeModal: null, modalData: null }),
    }),
    { name: "ModalStore" },
  ),
);

export const useDrawerStore = create(
  devtools(
    (set) => ({
      activeDrawer: null,
      drawerData: null,
      openDrawer: (id, data = null) => set({ activeDrawer: id, drawerData: data }),
      closeDrawer: () => set({ activeDrawer: null, drawerData: null }),
    }),
    { name: "DrawerStore" },
  ),
);

export const useUIStore = create(
  devtools(
    persist(
      (set) => ({
        isSidebarOpen: false,
        toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
        setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      }),
      createPersistOptions({ name: "bookento-ui", partialize: (s) => ({ isSidebarOpen: s.isSidebarOpen }) }),
    ),
    { name: "UIStore" },
  ),
);
