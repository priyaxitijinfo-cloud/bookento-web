"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";
import {
  AuthBrandLogo,
  LoginIllustration,
} from "@/features/auth/components/auth-illustrations";
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
        Login
      </h1>
      <p
        className={
          isWeb
            ? "mt-1.5 text-[15px] leading-relaxed text-[#667085]"
            : "mt-1.5 text-[13.5px] text-[#98A2B3]"
        }
      >
        Login to continue booking
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
      className={isWeb ? "flex flex-col gap-6" : "flex flex-col gap-6"}
    >
      <label className={isWeb ? "flex flex-col gap-2.5" : "flex flex-col gap-2.5"}>
        <span
          className={
            isWeb
              ? "text-[14px] font-semibold text-[#314158]"
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
            ? "mt-0.5 h-[3.25rem] rounded-xl text-base font-medium shadow-[0_10px_24px_rgba(24,101,234,0.28)]"
            : "mx-auto mt-1 h-[3.15rem] !w-[78%] rounded-full text-[16px] font-medium tracking-wide shadow-[0_10px_24px_rgba(24,101,234,0.3)]"
        }
      >
        Send OTP
      </AuthPrimaryButton>

      <OrDivider variant={variant} />
      <SocialAuthButtons variant={variant} onSelect={onSocial} disabled={loading} />

      <button
        type="button"
        onClick={onGuest}
        className={
          isWeb
            ? "mt-1 text-center text-[15px] font-medium text-[#1865EA] underline underline-offset-4 transition-opacity hover:opacity-80"
            : "mt-1 pt-1 text-center text-[15px] font-medium text-[#1865EA] underline underline-offset-4"
        }
      >
        Continue as Guest
      </button>

      <p
        className={
          isWeb
            ? "mt-1 text-center text-[13.5px] text-[#667085]"
            : "mt-2.5 pt-1 text-center text-[13px] text-[#64748B]"
        }
      >
        Are you a provider?{" "}
        <Link
          href={ROUTES.PROVIDER_LOGIN}
          className="font-semibold text-[#1865EA] hover:underline"
        >
          Provider Login
        </Link>
      </p>
    </form>
  );
}

export function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sendOtp, loginAsGuest, loginWithSocial, isLoading } = useUserAuthStore();
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

  const handleSocial = async (label) => {
    const result = await loginWithSocial(label);
    if (!result?.success) {
      toast.error(`${label} sign-in failed. Please try again.`);
      return;
    }
    toast.success(`Signed in with ${label}`);
    router.push(redirect || ROUTES.HOME);
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
            illustration={<AuthBrandLogo size={112} className="size-[7rem]" />}
            headline="Book trusted professionals nearby"
            copy="Find verified experts, compare options, and book in minutes — in person or online."
          >
            <LoginCopy variant="web" />
            <LoginFields variant="web" {...fieldProps} />
          </AuthWebFrame>
        }
        desktop={
          <AuthWebFrame
            illustration={<AuthBrandLogo size={144} className="size-[9rem]" />}
            headline="Book trusted professionals nearby"
            copy="Find verified experts, compare options, and book in minutes — in person or online."
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
