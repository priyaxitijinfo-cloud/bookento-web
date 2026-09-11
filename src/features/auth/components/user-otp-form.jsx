"use client";

import Link from "next/link";
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
    <div className={isWeb ? "mb-6" : "mb-7 text-center"}>
      <h1
        className={
          isWeb
            ? "text-2xl font-bold tracking-tight text-[#111827]"
            : "text-[1.75rem] font-bold text-[#111827]"
        }
      >
        Enter OTP
      </h1>
      <p
        className={
          isWeb ? "mt-1.5 text-sm text-[#667085]" : "mt-1 text-sm text-[#98A2B3]"
        }
      >
        Sent a 6-digit OTP to {destination}
      </p>
    </div>
  );
}

function ResendRow({ countdown, onResend, variant }) {
  const isWeb = variant === "web";
  return (
    <p
      className={
        isWeb
          ? "text-center text-sm text-[#667085]"
          : "text-center text-sm text-[#667085]"
      }
    >
      Don&apos;t receive code?{" "}
      {countdown > 0 ? (
        <span className="text-primary font-semibold">
          Resend {formatOtpTimer(countdown)}
        </span>
      ) : (
        <button
          type="button"
          onClick={onResend}
          className="text-primary font-semibold hover:underline"
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
  backHref,
}) {
  const isWeb = variant === "web";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <OtpBoxes value={otp} onChange={onOtpChange} variant={variant} />
      <AuthPrimaryButton
        type="submit"
        loading={loading}
        variant={isWeb ? "web" : "app"}
      >
        Verify
      </AuthPrimaryButton>
      <OrDivider variant={variant} />
      <ResendRow countdown={countdown} onResend={onResend} variant={variant} />
      {isWeb ? (
        <p className="text-center text-sm text-[#667085]">
          Wrong number?{" "}
          <Link href={backHref} className="text-primary font-semibold hover:underline">
            Change
          </Link>
        </p>
      ) : null}
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
  const backHref = isResetFlow ? ROUTES.FORGOT_PASSWORD : ROUTES.USER_LOGIN;

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
    backHref,
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
          illustration={<OtpIllustration className="h-44 w-52" />}
          headline="Check your phone"
          copy="Enter the 6-digit code we sent to verify your number and continue."
        >
          <OtpHeader variant="web" destination={destination} />
          <OtpFields variant="web" {...fieldProps} />
        </AuthWebFrame>
      }
      desktop={
        <AuthWebFrame
          illustration={<OtpIllustration className="h-52 w-60" />}
          headline="Check your phone"
          copy="Enter the 6-digit code we sent to verify your number and continue."
        >
          <OtpHeader variant="web" destination={destination} />
          <OtpFields variant="web" {...fieldProps} />
        </AuthWebFrame>
      }
    />
  );
}
