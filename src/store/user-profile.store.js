import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { currentUser, userAddresses } from "@/mock/users";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

export const useUserProfileStore = create(
  devtools(
    persist(
      (set) => ({
        profile: currentUser,
        addresses: userAddresses,
        isLoading: false,

        updateProfile: async (data) => {
          set({ isLoading: true });
          await delay(600);
          set((s) => ({ profile: { ...s.profile, ...data }, isLoading: false }));
          return { success: true };
        },

        addAddress: async (address) => {
          await delay(400);
          const newAddr = { ...address, id: `addr_${Date.now()}`, userId: currentUser.id };
          set((s) => ({ addresses: [...s.addresses, newAddr] }));
          return newAddr;
        },

        updateAddress: async (addressId, data) => {
          await delay(400);
          set((s) => ({
            addresses: s.addresses.map((address) =>
              address.id === addressId ? { ...address, ...data } : address,
            ),
          }));
          return { success: true };
        },

        deleteAddress: async (addressId) => {
          await delay(400);
          set((s) => ({
            addresses: s.addresses.filter((address) => address.id !== addressId),
          }));
          return { success: true };
        },
      }),
      createPersistOptions({
        name: "bookento-user-profile",
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...persistedState,
          profile: persistedState?.profile ?? currentState.profile,
          addresses: Array.isArray(persistedState?.addresses)
            ? persistedState.addresses
            : currentState.addresses,
        }),
      }),
    ),
    { name: "UserProfileStore" },
  ),
);

/** @deprecated Use useUserProfileStore */
export const useProfileStore = useUserProfileStore;
