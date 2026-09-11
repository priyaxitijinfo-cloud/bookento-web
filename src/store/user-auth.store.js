import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { AUTH_CONFIG } from "@/config/app.config";
import { EXISTING_USER_PHONES, mockAuthSessions, VALID_OTP } from "@/mock/auth";
import { clearAuthCookie, createMockToken, setAuthCookie } from "@/utils/format.utils";
import { delay } from "@/mock/helpers";
import { formatFullPhone, nationalDigits } from "@/features/auth/lib/phone";

import { createPersistOptions } from "./persist-storage";

function isRegisteredPhone(registeredPhones, phone) {
  const national = nationalDigits(phone);
  const known = Array.isArray(registeredPhones) ? registeredPhones : [];
  return known.includes(national) || EXISTING_USER_PHONES.includes(national);
}

function persistUserSession(session, extra = {}) {
  const token = createMockToken({
    sub: session.id,
    role: "user",
    email: session.email,
    ...extra,
  });
  setAuthCookie(
    AUTH_CONFIG.userAccessTokenCookie,
    token,
    AUTH_CONFIG.accessTokenMaxAge,
  );
}

export const useUserAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isGuest: false,
        pendingPhone: null,
        registeredPhones: [...EXISTING_USER_PHONES],

        login: async (email) => {
          set({ isLoading: true });
          await delay(800);

          const session = { ...mockAuthSessions.user, email };
          persistUserSession(session);

          set({
            user: session,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
          });

          return { success: true, user: session };
        },

        sendOtp: async (phone, dialCode = "+91") => {
          set({ isLoading: true });
          await delay(800);
          set({
            isLoading: false,
            pendingPhone: { phone: nationalDigits(phone), dialCode },
          });
          return { success: true };
        },

        verifyLoginOtp: async (otp, phone, dialCode = "+91") => {
          set({ isLoading: true });
          await delay(600);

          if (!VALID_OTP.includes(otp)) {
            set({ isLoading: false });
            return { success: false, message: "Invalid OTP" };
          }

          const national = nationalDigits(phone);
          const pendingPhone = { phone: national, dialCode };

          if (!isRegisteredPhone(get().registeredPhones, national)) {
            set({
              isLoading: false,
              pendingPhone,
            });
            return { success: true, isNew: true };
          }

          const session = {
            ...mockAuthSessions.user,
            phone: formatFullPhone(dialCode, national),
          };
          persistUserSession(session);

          set({
            user: session,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
            pendingPhone: null,
          });

          return { success: true, isNew: false, user: session };
        },

        completeRegistration: async ({
          name,
          phone,
          dialCode,
          dateOfBirth,
          gender,
          state,
        }) => {
          set({ isLoading: true });
          await delay(800);

          const national = nationalDigits(phone || get().pendingPhone?.phone);
          const code = dialCode || get().pendingPhone?.dialCode || "+91";
          const fullPhone = formatFullPhone(code, national);
          const session = {
            ...mockAuthSessions.user,
            name,
            phone: fullPhone,
            email: null,
          };
          persistUserSession(session);

          set({
            user: session,
            isAuthenticated: true,
            isGuest: false,
            isLoading: false,
            pendingPhone: null,
            registeredPhones: Array.from(
              new Set([...(get().registeredPhones || []), national]),
            ),
          });

          return {
            success: true,
            user: session,
            profile: {
              name,
              phone: fullPhone,
              dateOfBirth,
              gender,
              state,
            },
          };
        },

        loginAsGuest: async () => {
          set({ isLoading: true });
          await delay(400);
          set({
            user: mockAuthSessions.guest,
            isAuthenticated: true,
            isGuest: true,
            isLoading: false,
            pendingPhone: null,
          });
          return { success: true };
        },

        logout: async () => {
          await delay(300);
          clearAuthCookie(AUTH_CONFIG.userAccessTokenCookie);
          clearAuthCookie(AUTH_CONFIG.userRefreshTokenCookie);
          set({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            pendingPhone: null,
          });
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
          registeredPhones: state.registeredPhones,
        }),
        merge: (persistedState, currentState) => ({
          ...currentState,
          ...persistedState,
          registeredPhones: Array.isArray(persistedState?.registeredPhones)
            ? persistedState.registeredPhones
            : currentState.registeredPhones,
        }),
      }),
    ),
    { name: "UserAuthStore" },
  ),
);
