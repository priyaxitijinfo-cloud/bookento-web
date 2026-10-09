import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { AUTH_CONFIG } from "@/config/app.config";
import { PROVIDER_STATUS, USER_ROLES } from "@/constants/status.constants";
import { mockAuthSessions, VALID_OTP } from "@/mock/auth";
import { clearAuthCookie, createMockToken, setAuthCookie } from "@/utils/format.utils";
import { delay } from "@/mock/helpers";

import { createPersistOptions } from "./persist-storage";

const DEFAULT_REJECTION_REASON =
  "Your documents are not valid. Please upload valid documents and try again.";

function buildVerificationMeta(payload = {}) {
  const now = new Date();
  return {
    status: payload.status || PROVIDER_STATUS.PENDING,
    email: payload.email || "",
    name: payload.name || "Provider",
    businessName: payload.businessName || "Business",
    category: payload.category || "Provider",
    avatarSrc: payload.avatarSrc || "/images/app-icon.jpg",
    requestDate:
      payload.requestDate ||
      now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    requestTime:
      payload.requestTime ||
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    requestId:
      payload.requestId || `PR${String(now.getTime()).slice(-8).toUpperCase()}`,
    rejectionReason: payload.rejectionReason || DEFAULT_REJECTION_REASON,
    submittedAt: payload.submittedAt || now.toISOString(),
  };
}

export const useProviderAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        provider: null,
        isAuthenticated: false,
        isLoading: false,
        registrationDraft: { step: 1 },
        /** Docs verification shown on login: pending | rejected | approved */
        verificationApplication: null,

        pendingEmail: null,

        /** Validates credentials and "sends" login OTP — does not authenticate yet */
        login: async (email) => {
          set({ isLoading: true });
          await delay(800);
          set({
            isLoading: false,
            pendingEmail: email,
          });
          return { success: true };
        },

        /** Completes login after email OTP verification */
        verifyLoginOtp: async (otp, email) => {
          set({ isLoading: true });
          await delay(600);

          if (!VALID_OTP.includes(otp)) {
            set({ isLoading: false });
            return { success: false, message: "Invalid OTP" };
          }

          const resolvedEmail = email || get().pendingEmail || "";
          const application = get().verificationApplication;
          const emailMatches =
            !application?.email ||
            application.email.toLowerCase() === resolvedEmail.toLowerCase();

          const verificationStatus = emailMatches
            ? application?.status || PROVIDER_STATUS.APPROVED
            : PROVIDER_STATUS.APPROVED;

          if (
            verificationStatus === PROVIDER_STATUS.PENDING ||
            verificationStatus === PROVIDER_STATUS.REJECTED
          ) {
            set({ isLoading: false, pendingEmail: null });
            return {
              success: true,
              blocked: true,
              status: verificationStatus,
              provider: null,
            };
          }

          const session = {
            ...mockAuthSessions.provider,
            email: resolvedEmail,
            status: PROVIDER_STATUS.APPROVED,
          };

          const token = createMockToken({
            sub: session.id,
            role: USER_ROLES.PROVIDER,
            status: PROVIDER_STATUS.APPROVED,
            email: resolvedEmail,
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
            pendingEmail: null,
            verificationApplication: application
              ? { ...application, status: PROVIDER_STATUS.APPROVED }
              : null,
          });

          return { success: true, provider: session, status: PROVIDER_STATUS.APPROVED };
        },

        logout: async () => {
          await delay(300);
          clearAuthCookie(AUTH_CONFIG.providerAccessTokenCookie);
          clearAuthCookie(AUTH_CONFIG.providerRefreshTokenCookie);
          set({ provider: null, isAuthenticated: false, pendingEmail: null });
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

        setVerificationApplication: (payload) => {
          set({
            verificationApplication: payload ? buildVerificationMeta(payload) : null,
          });
        },

        updateVerificationStatus: (status, extras = {}) => {
          const current = get().verificationApplication;
          if (!current) {
            set({
              verificationApplication: buildVerificationMeta({ status, ...extras }),
            });
            return;
          }
          set({
            verificationApplication: {
              ...current,
              ...extras,
              status,
            },
          });
        },

        clearVerificationApplication: () => {
          set({ verificationApplication: null });
        },

        /**
         * Saves document verification as pending for login-screen status.
         * Does not authenticate — provider returns via Back to Login.
         */
        submitRegistration: async (payload = {}) => {
          set({ isLoading: true });
          await delay(900);
          const draft = get().registrationDraft;
          const application = buildVerificationMeta({
            status: PROVIDER_STATUS.PENDING,
            email: payload.email || draft.email,
            name: payload.name || draft.ownerName,
            businessName: payload.businessName || draft.businessName,
            category: payload.category || draft.category,
            avatarSrc: payload.avatarSrc || draft.avatarSrc,
            requestDate: payload.requestDate,
            requestTime: payload.requestTime,
            requestId: payload.requestId,
          });

          clearAuthCookie(AUTH_CONFIG.providerAccessTokenCookie);
          clearAuthCookie(AUTH_CONFIG.providerRefreshTokenCookie);

          set({
            verificationApplication: application,
            registrationDraft: {
              ...draft,
              ...payload,
              step: 6,
            },
            provider: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return { success: true, application };
        },

        /** After rejection, mark application pending again once docs are re-uploaded */
        resubmitRegistration: async (payload = {}) => {
          set({ isLoading: true });
          await delay(900);
          const current = get().verificationApplication;
          const application = buildVerificationMeta({
            ...current,
            ...payload,
            status: PROVIDER_STATUS.PENDING,
            rejectionReason: DEFAULT_REJECTION_REASON,
          });
          set({
            verificationApplication: application,
            isLoading: false,
            provider: null,
            isAuthenticated: false,
          });
          return { success: true, application };
        },

        /** Enter provider dashboard after registration success (mock approve + session). */
        enterProviderHome: async () => {
          set({ isLoading: true });
          await delay(400);

          const draft = get().registrationDraft;
          const application = get().verificationApplication;
          const email =
            application?.email || draft?.email || mockAuthSessions.provider.email;

          const session = {
            ...mockAuthSessions.provider,
            email,
            name:
              application?.name || draft?.ownerName || mockAuthSessions.provider.name,
            businessName:
              application?.businessName ||
              draft?.businessName ||
              mockAuthSessions.provider.businessName,
            avatar:
              application?.avatarSrc ||
              draft?.avatarSrc ||
              mockAuthSessions.provider.avatar,
            status: PROVIDER_STATUS.APPROVED,
          };

          const token = createMockToken({
            sub: session.id,
            role: USER_ROLES.PROVIDER,
            status: PROVIDER_STATUS.APPROVED,
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
            pendingEmail: null,
            verificationApplication: application
              ? { ...application, status: PROVIDER_STATUS.APPROVED }
              : buildVerificationMeta({
                  status: PROVIDER_STATUS.APPROVED,
                  email,
                  name: session.name,
                  businessName: session.businessName,
                  avatarSrc: session.avatar,
                }),
            registrationDraft: {
              ...draft,
              step: 1,
            },
          });

          return { success: true, provider: session };
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
          verificationApplication: state.verificationApplication,
        }),
      }),
    ),
    { name: "ProviderAuthStore" },
  ),
);
