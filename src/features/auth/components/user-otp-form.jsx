"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import { OtpIllustration } from "@/features/auth/components/auth-illustrations";
import {
  AuthMobileFrame,
  AuthPrimaryButton,
  AuthWebFrame,
  OrDivider,
  OtpBoxes,
  useOtpCountdown,
} from "@/features/auth/components/auth-shared";
import { formatFullPhone, formatOtpTimer } from "@/features/auth/lib/phone";
import { useUserAuthStore } from "@/store";

const OTP_LENGTH = 6;

function OtpHeader({ variant, destination }) {
  const isWeb = variant === "web";
  return (
    <div
      className={
        isWeb
          ? "mb-7 border-b border-[#EEF1F6] pb-5 text-center"
          : "mb-6 border-b border-[#EEF1F6] pb-6 text-center"
      }
    >
      <h1
        className={
          isWeb
            ? "text-[1.85rem] font-bold tracking-tight text-[#0F1B2D]"
            : "text-[1.65rem] font-bold tracking-tight text-[#111827]"
        }
      >
        Enter OTP
      </h1>
      <p
        className={
          isWeb
            ? "mt-1.5 text-[15px] leading-relaxed text-[#667085]"
            : "mt-1.5 text-[13.5px] text-[#98A2B3]"
        }
      >
        Sent a 6-digit OTP to {destination}
      </p>
    </div>
  );
}

function ResendRow({ countdown, onResend }) {
  return (
    <p className="text-center text-[15px] text-[#667085]">
      Don&apos;t Receive Code?{" "}
      {countdown > 0 ? (
        <span className="font-medium text-[#1865EA]">
          Resend {formatOtpTimer(countdown)}
        </span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          className="font-medium text-[#1865EA] underline underline-offset-4"
        >
          Resend OTP
        </button>
      )}
    </p>
  );
}

function OtpFields({
  variant,
  otp,
  onOtpChange,
  loading,
  onSubmit,
  countdown,
  onResend,
}) {
  const isWeb = variant === "web";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <OtpBoxes value={otp} onChange={onOtpChange} variant={variant} />
      <AuthPrimaryButton
        type="submit"
        loading={loading}
        variant={isWeb ? "web" : "app"}
        className={
          isWeb
            ? "mt-0.5 h-[3.25rem] w-full rounded-xl text-base font-medium shadow-[0_10px_24px_rgba(24,101,234,0.28)]"
            : "mx-auto mt-1 h-[3.15rem] !w-[78%] rounded-full text-[16px] font-medium tracking-wide shadow-[0_10px_24px_rgba(24,101,234,0.3)]"
        }
      >
        Verify
      </AuthPrimaryButton>
      <OrDivider variant={variant} />
      <ResendRow countdown={countdown} onResend={onResend} />
    </form>
  );
}

export function UserOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyLoginOtp, verifyOtp, sendOtp, isLoading } = useUserAuthStore();
  const { countdown, restart } = useOtpCountdown(90);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  const phone = searchParams.get("phone") || "";
  const dial = searchParams.get("dial") || "+91";
  const email = searchParams.get("email") || "";
  const redirect = searchParams.get("redirect");
  const isResetFlow = Boolean(email) && !phone;
  const destination = isResetFlow ? email : formatFullPhone(dial, phone);

  useEffect(() => {
    if (!phone && !email) {
      router.replace(ROUTES.USER_LOGIN);
    }
  }, [phone, email, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete OTP");
      return;
    }

    if (isResetFlow) {
      const result = await verifyOtp(code);
      if (!result.success) {
        toast.error(result.message || "Invalid OTP");
        return;
      }
      toast.success("OTP verified!");
      router.push(
        `${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${code}`,
      );
      return;
    }

    const result = await verifyLoginOtp(code, phone, dial);
    if (!result.success) {
      toast.error(result.message || "Invalid OTP");
      return;
    }

    toast.success("OTP verified!");
    if (result.isNew) {
      const params = new URLSearchParams({ phone, dial });
      if (redirect) params.set("redirect", redirect);
      router.push(`${ROUTES.USER_REGISTER}?${params.toString()}`);
      return;
    }

    router.push(redirect || ROUTES.HOME);
  };

  const handleResend = async () => {
    if (!isResetFlow) {
      await sendOtp(phone, dial);
    }
    restart();
    setOtp(Array(OTP_LENGTH).fill(""));
    toast.success("New OTP sent!");
  };

  const fieldProps = {
    otp,
    onOtpChange: setOtp,
    loading: isLoading,
    onSubmit: handleSubmit,
    countdown,
    onResend: handleResend,
  };

  return (
    <ResponsiveView
      fallback={<PageLoader />}
      mobile={
        <AuthMobileFrame illustration={<OtpIllustration />}>
          <OtpHeader variant="app" destination={destination} />
          <OtpFields variant="app" {...fieldProps} />
        </AuthMobileFrame>
      }
      tablet={
        <AuthWebFrame
          illustration={<OtpIllustration className="!h-auto !w-full" />}
          headline="Book trusted professionals nearby"
          copy="Find verified experts, compare options, and book in minutes — in person or online."
        >
          <OtpHeader variant="web" destination={destination} />
          <OtpFields variant="web" {...fieldProps} />
        </AuthWebFrame>
      }
      desktop={
        <AuthWebFrame
          illustration={<OtpIllustration className="!h-auto !w-full" />}
          headline="Book trusted professionals nearby"
          copy="Find verified experts, compare options, and book in minutes — in person or online."
        >
          <OtpHeader variant="web" destination={destination} />
          <OtpFields variant="web" {...fieldProps} />
        </AuthWebFrame>
      }
    />
  );
}
