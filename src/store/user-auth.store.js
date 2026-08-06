import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { AUTH_CONFIG } from "@/config/app.config";
import { mockAuthSessions, VALID_OTP } from "@/mock/auth";
import { clearAuthCookie, createMockToken, setAuthCookie } from "@/utils/format.utils";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

export const useUserAuthStore = create(
  devtools(
    persist(
      (set) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isGuest: false,

        login: async (email) => {
          set({ isLoading: true });
          await delay(800);

          const session = { ...mockAuthSessions.user, email };
          const token = createMockToken({
            sub: session.id,
            role: "user",
            email,
          });

          setAuthCookie(AUTH_CONFIG.userAccessTokenCookie, token, AUTH_CONFIG.accessTokenMaxAge);

          set({
            user: session,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
          });

          return { success: true, user: session };
        },

        loginAsGuest: async () => {
          set({ isLoading: true });
          await delay(400);
          set({
            user: mockAuthSessions.guest,
            isAuthenticated: true,
            isGuest: true,
            isLoading: false,
          });
          return { success: true };
        },

        logout: async () => {
          await delay(300);
          clearAuthCookie(AUTH_CONFIG.userAccessTokenCookie);
          clearAuthCookie(AUTH_CONFIG.userRefreshTokenCookie);
          set({ user: null, isAuthenticated: false, isGuest: false });
        },

        verifyOtp: async (otp) => {
          set({ isLoading: true });
          await delay(600);
          const valid = VALID_OTP.includes(otp);
          set({ isLoading: false });
          return { success: valid, message: valid ? "OTP verified" : "Invalid OTP" };
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
        name: "bookento-user-auth",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isGuest: state.isGuest,
        }),
      }),
    ),
    { name: "UserAuthStore" },
  ),
);
