"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PageLoader } from "@/components/ui/skeleton";
import {
  ProviderAuthField,
  ProviderAuthResponsive,
  ProviderContinueButton,
} from "@/features/auth/components/provider-auth-shell";
import { useOtpCountdown } from "@/features/auth/components/auth-shared";
import { ROUTES } from "@/constants/routes.constants";
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
      <div className="flex justify-between gap-2">
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
              "size-12 rounded-xl border text-center text-lg font-semibold text-[#0F172A] outline-none",
              digit || focused === index
                ? "border-[#1865EA] bg-[#EEF4FF]"
                : "border-[#E2E8F0] bg-[#F8FAFC]",
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
  const email = searchParams.get("email") || "your email";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { countdown, restart } = useOtpCountdown(90);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("OTP verified");
    router.push(`${ROUTES.PROVIDER_RESET_PASSWORD}?email=${encodeURIComponent(email)}`);
  };

  return (
    <ProviderAuthResponsive
      title="Verification Code"
      subtitle={`Verification code sent to ${email}. Check spam if needed.`}
      headline="Verify your email"
      copy="Enter the 6-digit code we sent to continue resetting your password."
      footer={
        <ProviderContinueButton
          type="submit"
          form="provider-otp-form"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Continue"}
        </ProviderContinueButton>
      }
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
              onClick={() => {
                restart();
                toast.success("OTP resent");
              }}
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
