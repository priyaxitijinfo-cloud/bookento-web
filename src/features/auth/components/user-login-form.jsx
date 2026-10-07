"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import { LoginIllustration } from "@/features/auth/components/auth-illustrations";
import {
  AuthMobileFrame,
  AuthPrimaryButton,
  AuthWebFrame,
  CountryCodePicker,
  OrDivider,
  PhoneNumberField,
  SocialAuthButtons,
  useCountry,
} from "@/features/auth/components/auth-shared";
import { useUserAuthStore } from "@/store";

function LoginCopy({ variant }) {
  const isWeb = variant === "web";
  return (
    <div className={isWeb ? "mb-8" : "mb-7 text-center"}>
      {isWeb ? (
        <p className="text-[12px] font-semibold tracking-[0.16em] text-[#1865EA] uppercase">
          Secure login
        </p>
      ) : null}
      <h1
        className={
          isWeb
            ? "mt-2 text-[1.85rem] font-bold tracking-tight text-[#0F1B2D]"
            : "text-[1.75rem] font-bold text-[#111827]"
        }
      >
        Login
      </h1>
      <p
        className={
          isWeb
            ? "mt-2 text-[15px] leading-relaxed text-[#667085]"
            : "mt-1 text-sm text-[#98A2B3]"
        }
      >
        {isWeb
          ? "Enter your mobile number. We’ll send a one-time password to verify it’s you."
          : "Login to continue booking"}
      </p>
    </div>
  );
}

function LoginFields({
  variant,
  country,
  phone,
  error,
  loading,
  onPhoneChange,
  onCountryClick,
  onSubmit,
  onSocial,
  onGuest,
}) {
  const isWeb = variant === "web";

  return (
    <form
      onSubmit={onSubmit}
      className={isWeb ? "flex flex-col gap-5" : "flex flex-col gap-5"}
    >
      <label className="flex flex-col gap-2">
        <span
          className={
            isWeb
              ? "text-[13px] font-semibold text-[#314158]"
              : "text-[15px] font-medium text-[#334155]"
          }
        >
          Mobile number
        </span>
        <PhoneNumberField
          variant={variant}
          country={country}
          phone={phone}
          onPhoneChange={onPhoneChange}
          onCountryClick={onCountryClick}
          error={error}
        />
      </label>

      <AuthPrimaryButton
        type="submit"
        loading={loading}
        variant={isWeb ? "web" : "app"}
        className={
          isWeb
            ? "mt-1 h-[3.25rem] rounded-xl text-base shadow-[0_10px_24px_rgba(24,101,234,0.28)]"
            : undefined
        }
      >
        Send OTP
      </AuthPrimaryButton>

      <OrDivider variant={variant} />
      <SocialAuthButtons variant={variant} onSelect={onSocial} />

      <button
        type="button"
        onClick={onGuest}
        className={
          isWeb
            ? "mt-1 h-11 rounded-xl border border-[#E8EDF5] bg-[#F8FAFC] text-sm font-semibold text-[#1865EA] transition-colors hover:bg-[#F0F5FF]"
            : "text-primary pt-1 text-center text-[15px] font-semibold"
        }
      >
        Continue as Guest
      </button>

      {isWeb ? (
        <p className="mt-2 text-center text-[13.5px] text-[#667085]">
          Are you a provider?{" "}
          <Link
            href={ROUTES.PROVIDER_LOGIN}
            className="font-semibold text-[#1865EA] hover:underline"
          >
            Provider Login
          </Link>
        </p>
      ) : null}
    </form>
  );
}

export function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendOtp, loginAsGuest, isLoading } = useUserAuthStore();
  const { country, countryCode, setCountryCode, pickerOpen, setPickerOpen } =
    useCountry();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const redirect = searchParams.get("redirect");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (phone.length < 10) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    const result = await sendOtp(phone, country.dialCode);
    if (!result.success) return;
    toast.success("OTP sent");
    const params = new URLSearchParams({
      phone,
      dial: country.dialCode,
    });
    if (redirect) params.set("redirect", redirect);
    router.push(`${ROUTES.VERIFY_OTP}?${params.toString()}`);
  };

  const handleGuest = async () => {
    await loginAsGuest();
    toast.success("Continuing as guest");
    router.push(ROUTES.HOME);
  };

  const handleSocial = (label) => {
    toast.info(`${label} sign-in coming soon`);
  };

  const fieldProps = {
    country,
    phone,
    error,
    loading: isLoading,
    onPhoneChange: (value) => {
      setPhone(value);
      if (error) setError("");
    },
    onCountryClick: () => setPickerOpen(true),
    onSubmit: handleSubmit,
    onSocial: handleSocial,
    onGuest: handleGuest,
  };

  return (
    <>
      <ResponsiveView
        fallback={<PageLoader />}
        mobile={
          <AuthMobileFrame illustration={<LoginIllustration />}>
            <LoginCopy variant="app" />
            <LoginFields variant="app" {...fieldProps} />
          </AuthMobileFrame>
        }
        tablet={
          <AuthWebFrame
            illustration={<LoginIllustration className="h-44 w-52" />}
            headline="Login to continue booking"
            copy="Use your mobile number. We'll send a one-time password to verify it's you."
          >
            <LoginCopy variant="web" />
            <LoginFields variant="web" {...fieldProps} />
          </AuthWebFrame>
        }
        desktop={
          <AuthWebFrame
            illustration={<LoginIllustration className="h-52 w-60" />}
            headline="Login to continue booking"
            copy="Use your mobile number. We'll send a one-time password to verify it's you."
          >
            <LoginCopy variant="web" />
            <LoginFields variant="web" {...fieldProps} />
          </AuthWebFrame>
        }
      />
      <CountryCodePicker
        open={pickerOpen}
        value={countryCode}
        onSelect={setCountryCode}
        onClose={() => setPickerOpen(false)}
      />
    </>
  );
}
