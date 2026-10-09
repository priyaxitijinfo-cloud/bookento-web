"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PageLoader } from "@/components/ui/skeleton";
import { OtpIllustration } from "@/features/auth/components/auth-illustrations";
import {
  ProviderAuthField,
  ProviderAuthResponsive,
  ProviderContinueButton,
} from "@/features/auth/components/provider-auth-shell";
import { useOtpCountdown } from "@/features/auth/components/auth-shared";
import { ROUTES } from "@/constants/routes.constants";
import { useProviderAuthStore } from "@/store";
import { cn } from "@/lib/utils";

function OtpBoxes({ value, onChange, error }) {
  const refs = useRef([]);
  const [focused, setFocused] = useState(0);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || "");

  const setDigit = (index, digit) => {
    const next = digits.map((d, i) => (i === index ? digit : d));
    onChange(next.join("").slice(0, 6));
    if (digit && index < 5) refs.current[index + 1]?.focus();
  };

  return (
    <div>
      <div className="flex justify-between gap-2 sm:gap-2.5">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onFocus={() => setFocused(index)}
            onChange={(e) => {
              const char = e.target.value.replace(/\D/g, "").slice(-1);
              setDigit(index, char);
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !digits[index] && index > 0) {
                refs.current[index - 1]?.focus();
              }
            }}
            className={cn(
              "aspect-square w-full max-w-[3.25rem] rounded-xl border bg-white text-center text-lg font-semibold text-[#0F172A] transition-colors outline-none",
              focused === index
                ? "border-[#1865EA] shadow-[0_0_0_1px_rgba(24,101,234,0.2)]"
                : digit
                  ? "border-[#CBD5E1]"
                  : "border-[#E2E8F0]",
              error && "border-red-300",
            )}
          />
        ))}
      </div>
      {error ? <p className="mt-2 text-[12.5px] text-red-500">{error}</p> : null}
    </div>
  );
}

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const flow = searchParams.get("flow") || "reset";
  const redirect = searchParams.get("redirect");
  const isLoginFlow = flow === "login";

  const { verifyLoginOtp, verifyOtp, login, isLoading } = useProviderAuthStore();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { countdown, restart } = useOtpCountdown(90);

  useEffect(() => {
    if (!email) {
      router.replace(
        isLoginFlow ? ROUTES.PROVIDER_LOGIN : ROUTES.PROVIDER_FORGOT_PASSWORD,
      );
    }
  }, [email, isLoginFlow, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setError("");

    if (isLoginFlow) {
      const result = await verifyLoginOtp(otp, email);
      if (!result.success) {
        setError(result.message || "Invalid OTP");
        toast.error(result.message || "Invalid OTP");
        return;
      }
      toast.success("Welcome back!");
      router.push(redirect || ROUTES.PROVIDER_HOME);
      return;
    }

    const result = await verifyOtp(otp);
    if (!result.success) {
      setError(result.message || "Invalid OTP");
      toast.error(result.message || "Invalid OTP");
      return;
    }
    toast.success("OTP verified");
    router.push(`${ROUTES.PROVIDER_RESET_PASSWORD}?email=${encodeURIComponent(email)}`);
  };

  const handleResend = async () => {
    if (isLoginFlow) {
      await login(email);
    }
    restart();
    setOtp("");
    toast.success("OTP resent");
  };

  const continueBtn = (
    <ProviderContinueButton type="submit" form="provider-otp-form" disabled={isLoading}>
      {isLoading ? "Verifying..." : "Continue"}
    </ProviderContinueButton>
  );

  return (
    <ProviderAuthResponsive
      title="Verification Code"
      subtitle={`Verification code sent to ${email || "your email"}. Check spam if needed.`}
      headline={isLoginFlow ? "Secure sign-in" : "Verify your email"}
      copy={
        isLoginFlow
          ? "Enter the 6-digit code we emailed you to complete provider sign-in."
          : "Enter the 6-digit code we sent to continue resetting your password."
      }
      webIllustration={
        <div className="relative flex size-full items-center justify-center">
          <OtpIllustration className="!h-auto max-h-[11rem] !w-full object-contain" />
        </div>
      }
      footer={continueBtn}
    >
      <form id="provider-otp-form" onSubmit={handleSubmit} className="space-y-6">
        <ProviderAuthField label="Enter OTP">
          <OtpBoxes value={otp} onChange={setOtp} error={error} />
        </ProviderAuthField>

        <p className="text-center text-[13.5px] text-[#64748B]">
          Don&apos;t Receive Code?{" "}
          {countdown > 0 ? (
            <span className="font-semibold text-[#1865EA]">
              Resend {String(Math.floor(countdown / 60)).padStart(2, "0")}:
              {String(countdown % 60).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#1865EA] hover:underline"
            >
              Resend OTP
            </button>
          )}
        </p>
      </form>
    </ProviderAuthResponsive>
  );
}

export default function ProviderVerifyOtpPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
