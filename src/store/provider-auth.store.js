import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { AUTH_CONFIG } from "@/config/app.config";
import { USER_ROLES } from "@/constants/status.constants";
import { mockAuthSessions, VALID_OTP } from "@/mock/auth";
import { currentProvider } from "@/mock/providers";
import { clearAuthCookie, createMockToken, setAuthCookie } from "@/utils/format.utils";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

export const useProviderAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        provider: null,
        isAuthenticated: false,
        isLoading: false,
        registrationDraft: { step: 1 },

        login: async (email) => {
          set({ isLoading: true });
          await delay(800);

          const session = {
            ...mockAuthSessions.provider,
            email,
            status: "approved",
          };

          const token = createMockToken({
            sub: session.id,
            role: USER_ROLES.PROVIDER,
            status: "approved",
            email,
          });

          setAuthCookie(
            AUTH_CONFIG.providerAccessTokenCookie,
            token,
            AUTH_CONFIG.accessTokenMaxAge,
          );

          set({
            provider: session,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, provider: session };
        },

        logout: async () => {
          await delay(300);
          clearAuthCookie(AUTH_CONFIG.providerAccessTokenCookie);
          clearAuthCookie(AUTH_CONFIG.providerRefreshTokenCookie);
          set({ provider: null, isAuthenticated: false });
        },

        verifyOtp: async (otp) => {
          set({ isLoading: true });
          await delay(600);
          const valid = VALID_OTP.includes(otp);
          set({ isLoading: false });
          return { success: valid, message: valid ? "OTP verified" : "Invalid OTP" };
        },

        updateRegistrationDraft: (data) => {
          set((state) => ({
            registrationDraft: { ...state.registrationDraft, ...data },
          }));
        },

        submitRegistration: async () => {
          set({ isLoading: true });
          await delay(1200);
          const token = createMockToken({
            sub: currentProvider.id,
            role: USER_ROLES.PROVIDER,
            status: "pending",
            email: get().registrationDraft.email,
          });
          setAuthCookie(
            AUTH_CONFIG.providerAccessTokenCookie,
            token,
            AUTH_CONFIG.accessTokenMaxAge,
          );
          set({
            provider: { ...mockAuthSessions.provider, status: "pending" },
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true };
        },

        forgotPassword: async () => {
          set({ isLoading: true });
          await delay(800);
          set({ isLoading: false });
          return { success: true };
        },

        resetPassword: async () => {
          set({ isLoading: true });
          await delay(800);
          set({ isLoading: false });
          return { success: true };
        },
      }),
      createPersistOptions({
        name: "bookento-provider-auth",
        partialize: (state) => ({
          provider: state.provider,
          isAuthenticated: state.isAuthenticated,
          registrationDraft: state.registrationDraft,
        }),
      }),
    ),
    { name: "ProviderAuthStore" },
  ),
);
