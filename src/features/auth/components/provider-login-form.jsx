"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { PageLoader } from "@/components/ui/skeleton";
import {
  ProviderAuthField,
  ProviderAuthMobileShell,
  ProviderAuthWebShell,
  ProviderContinueButton,
  providerAuthInputClass,
} from "@/features/auth/components/provider-auth-shell";
import { ProviderLoginVerificationBanner } from "@/features/auth/components/provider-registration-status-view";
import { ROUTES } from "@/constants/routes.constants";
import { PROVIDER_STATUS } from "@/constants/status.constants";
import { useProviderAuthStore } from "@/store";
import { cn } from "@/lib/utils";

const DEMO_STATUSES = new Set([
  PROVIDER_STATUS.PENDING,
  PROVIDER_STATUS.REJECTED,
  PROVIDER_STATUS.APPROVED,
]);

function ProviderLoginFields({
  variant,
  email,
  password,
  errors,
  isLoading,
  verificationApplication,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onResubmit,
}) {
  const isApp = variant === "app";

  return (
    <form
      onSubmit={onSubmit}
      className={isApp ? "flex flex-col gap-5" : "flex flex-col gap-5"}
    >
      {verificationApplication ? (
        <ProviderLoginVerificationBanner
          application={verificationApplication}
          onResubmit={onResubmit}
        />
      ) : null}

      <ProviderAuthField label="Email Address" error={errors.email}>
        <input
          type="email"
          value={email}
          onChange={onEmailChange}
          placeholder="Your email address"
          className={providerAuthInputClass(errors.email)}
          autoComplete="email"
        />
      </ProviderAuthField>

      <ProviderAuthField label="Password" error={errors.password}>
        <PasswordInput
          value={password}
          onChange={onPasswordChange}
          placeholder="Your Password"
          className={cn(providerAuthInputClass(errors.password), "pr-11")}
          autoComplete="current-password"
        />
        <div className="mt-1.5 flex justify-end">
          <Link
            href={ROUTES.PROVIDER_FORGOT_PASSWORD}
            className="text-[13px] font-medium text-[#F07167] hover:underline"
          >
            Forgot Password
          </Link>
        </div>
      </ProviderAuthField>

      <ProviderContinueButton
        type="submit"
        disabled={isLoading}
        className={isApp ? "mt-3" : "mt-2"}
      >
        {isLoading ? "Signing in..." : "Continue"}
      </ProviderContinueButton>

      {isApp ? (
        <p className="mt-6 text-center text-[13px] text-[#64748B]">
          Don&apos;t have an account?{" "}
          <Link
            href={ROUTES.PROVIDER_REGISTER}
            className="font-semibold text-[#1865EA] hover:underline"
          >
            Register as Provider
          </Link>
        </p>
      ) : (
        <p className="pt-1 text-center text-[13px] text-[#64748B]">
          Looking for services?{" "}
          <Link
            href={ROUTES.USER_LOGIN}
            className="font-semibold text-[#1865EA] hover:underline"
          >
            User Login
          </Link>
        </p>
      )}
    </form>
  );
}

export function ProviderLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    login,
    isLoading,
    verificationApplication,
    setVerificationApplication,
    updateVerificationStatus,
    registrationDraft,
  } = useProviderAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const redirect = searchParams.get("redirect");
  const statusParam = searchParams.get("status");

  useEffect(() => {
    if (!DEMO_STATUSES.has(statusParam)) return;
    if (verificationApplication?.status === statusParam) return;

    if (verificationApplication) {
      updateVerificationStatus(statusParam);
      return;
    }

    setVerificationApplication({
      status: statusParam,
      email: registrationDraft?.email || "provider@business.com",
      name: registrationDraft?.ownerName || "Dr. Amara Reyes",
      businessName: registrationDraft?.businessName || "UrbanCare Clinic",
      category: registrationDraft?.category || "Gynecologist",
      avatarSrc: registrationDraft?.avatarSrc || "/images/app-icon.jpg",
    });
  }, [
    statusParam,
    verificationApplication,
    registrationDraft,
    setVerificationApplication,
    updateVerificationStatus,
  ]);

  useEffect(() => {
    if (verificationApplication?.email && !email) {
      setEmail(verificationApplication.email);
    }
  }, [verificationApplication, email]);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleResubmit = () => {
    router.push(`${ROUTES.PROVIDER_REGISTER}?resubmit=1`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const status = verificationApplication?.status;
    const emailMatches =
      !verificationApplication?.email ||
      verificationApplication.email.toLowerCase() === email.trim().toLowerCase();

    if (
      emailMatches &&
      (status === PROVIDER_STATUS.PENDING || status === PROVIDER_STATUS.REJECTED)
    ) {
      toast.message(
        status === PROVIDER_STATUS.REJECTED
          ? "Documents were rejected. Re-submit to continue."
          : "Your documents are still under review.",
      );
      router.push(
        status === PROVIDER_STATUS.REJECTED
          ? `${ROUTES.PROVIDER_REGISTRATION_STATUS}?status=rejected`
          : ROUTES.PROVIDER_REGISTRATION_STATUS,
      );
      return;
    }

    const result = await login(email.trim());
    if (result.success) {
      toast.success("OTP sent to your email");
      const params = new URLSearchParams({
        email: email.trim(),
        flow: "login",
      });
      if (redirect) params.set("redirect", redirect);
      router.push(`${ROUTES.PROVIDER_VERIFY_OTP}?${params.toString()}`);
    }
  };

  const fieldProps = {
    email,
    password,
    errors,
    isLoading,
    verificationApplication,
    onEmailChange: (e) => setEmail(e.target.value),
    onPasswordChange: (e) => setPassword(e.target.value),
    onSubmit: handleSubmit,
    onResubmit: handleResubmit,
  };

  const appShellProps = {
    title: "Welcome Back!",
    subtitle: "Sign in to your account to continue managing your services.",
  };

  const webShellProps = {
    ...appShellProps,
    wide: true,
    headline: "Welcome back, Pro",
    copy: "Sign in to manage appointments, earnings, and your business profile.",
    footer: (
      <p className="text-center text-[13.5px] text-[#64748B]">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.PROVIDER_REGISTER}
          className="font-semibold text-[#1865EA] hover:underline"
        >
          Register as Provider
        </Link>
      </p>
    ),
  };

  return (
    <ResponsiveView
      fallback={<PageLoader />}
      mobile={
        <ProviderAuthMobileShell {...appShellProps}>
          <ProviderLoginFields variant="app" {...fieldProps} />
        </ProviderAuthMobileShell>
      }
      tablet={
        <ProviderAuthWebShell {...webShellProps}>
          <ProviderLoginFields variant="web" {...fieldProps} />
        </ProviderAuthWebShell>
      }
      desktop={
        <ProviderAuthWebShell {...webShellProps}>
          <ProviderLoginFields variant="web" {...fieldProps} />
        </ProviderAuthWebShell>
      }
    />
  );
}
