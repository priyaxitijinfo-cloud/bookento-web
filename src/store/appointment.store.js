import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { appointments as mockAppointments, providerAppointments } from "@/mock/appointments";
import { delay } from "@/mock/helpers";

export const useAppointmentStore = create(
  devtools(
    (set, get) => ({
      appointments: mockAppointments,
      providerAppointments,
      selectedAppointment: null,
      isLoading: false,

      fetchAppointments: async () => {
        set({ isLoading: true });
        await delay(400);
        set({ isLoading: false });
        return get().appointments;
      },

      fetchProviderAppointments: async () => {
        set({ isLoading: true });
        await delay(400);
        set({ isLoading: false });
        return get().providerAppointments;
      },

      updateStatus: (id, status) => {
        set((s) => ({
          providerAppointments: s.providerAppointments.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        }));
      },

      setSelected: (appointment) => set({ selectedAppointment: appointment }),
    }),
    { name: "AppointmentStore" },
  ),
);
