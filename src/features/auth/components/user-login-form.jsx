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
    <div className={isWeb ? "mb-6" : "mb-7 text-center"}>
      <h1 className={cnTitle(isWeb)}>Login</h1>
      <p className={cnSubtitle(isWeb)}>
        {isWeb
          ? "Enter your mobile number to continue booking."
          : "Login to continue booking"}
      </p>
    </div>
  );
}

function cnTitle(isWeb) {
  return isWeb
    ? "text-2xl font-bold tracking-tight text-[#111827]"
    : "text-[1.75rem] font-bold text-[#111827]";
}

function cnSubtitle(isWeb) {
  return isWeb ? "mt-1.5 text-sm text-[#667085]" : "mt-1 text-sm text-[#98A2B3]";
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
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className="text-[15px] font-medium text-[#334155]">Mobile number</span>
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
            ? "text-primary text-sm font-semibold hover:underline"
            : "text-primary pt-1 text-center text-[15px] font-semibold"
        }
      >
        Continue as Guest
      </button>

      {isWeb ? (
        <p className="text-center text-sm text-[#667085]">
          Are you a provider?{" "}
          <Link
            href={ROUTES.PROVIDER_LOGIN}
            className="text-primary font-semibold hover:underline"
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
