import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import {
  appointments as mockAppointments,
  providerAppointments,
} from "@/mock/appointments";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

export const useAppointmentStore = create(
  devtools(
    persist(
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

        createAppointment: (appointment) => {
          if (!appointment) return null;
          set((state) => ({
            appointments: [
              appointment,
              ...state.appointments.filter((item) => item.id !== appointment.id),
            ],
          }));
          return appointment;
        },

        updateStatus: (id, status) => {
          set((s) => ({
            providerAppointments: s.providerAppointments.map((a) =>
              a.id === id ? { ...a, status } : a,
            ),
            appointments: s.appointments.map((a) =>
              a.id === id ? { ...a, status } : a,
            ),
          }));
        },

        setSelected: (appointment) => set({ selectedAppointment: appointment }),
      }),
      createPersistOptions({
        name: "bookento-appointments",
        version: 1,
        partialize: (state) => ({ appointments: state.appointments }),
      }),
    ),
    { name: "AppointmentStore" },
  ),
);
