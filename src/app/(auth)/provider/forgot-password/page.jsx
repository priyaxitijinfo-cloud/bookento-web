"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  ProviderAuthField,
  ProviderAuthResponsive,
  ProviderContinueButton,
  providerAuthInputClass,
} from "@/features/auth/components/provider-auth-shell";
import { ROUTES } from "@/constants/routes.constants";

export default function ProviderForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("OTP sent to your email");
    router.push(`${ROUTES.PROVIDER_VERIFY_OTP}?email=${encodeURIComponent(email)}`);
  };

  return (
    <ProviderAuthResponsive
      title="Reset Password"
      subtitle="Enter your registered e-mail address to receive a password reset link."
      headline="Reset your password"
      copy="We'll email a verification code so you can securely set a new password."
      footer={
        <ProviderContinueButton
          type="submit"
          form="provider-forgot-form"
          disabled={loading}
        >
          {loading ? "Sending..." : "Continue"}
        </ProviderContinueButton>
      }
    >
      <form id="provider-forgot-form" onSubmit={handleSubmit} className="space-y-5">
        <ProviderAuthField label="Email Address" error={error}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className={providerAuthInputClass(error)}
            autoComplete="email"
          />
        </ProviderAuthField>
      </form>
    </ProviderAuthResponsive>
  );
}
