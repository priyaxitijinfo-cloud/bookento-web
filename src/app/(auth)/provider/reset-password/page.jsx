"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { PageLoader } from "@/components/ui/skeleton";
import {
  ProviderAuthField,
  ProviderAuthResponsive,
  ProviderContinueButton,
  providerAuthInputClass,
} from "@/features/auth/components/provider-auth-shell";
import { ROUTES } from "@/constants/routes.constants";
import { cn } from "@/lib/utils";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!password || password.length < 8) {
      next.password = "Password must be at least 8 characters";
    }
    if (password !== confirm) next.confirm = "Passwords do not match";
    setErrors(next);
    if (Object.keys(next).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    toast.success("Password reset successfully");
    router.push(ROUTES.PROVIDER_LOGIN);
  };

  const continueBtn = (
    <ProviderContinueButton type="submit" form="provider-reset-form" disabled={loading}>
      {loading ? "Saving..." : "Continue"}
    </ProviderContinueButton>
  );

  return (
    <ProviderAuthResponsive
      title="New Password"
      subtitle="Enter your registered e-mail address to receive a password reset link."
      headline="Create a new password"
      copy={
        email
          ? `Set a strong new password for ${email}.`
          : "Use at least 8 characters with a mix of letters and numbers."
      }
      footer={continueBtn}
    >
      <form id="provider-reset-form" onSubmit={handleSubmit} className="space-y-5">
        <ProviderAuthField label="Email Address">
          <input
            type="email"
            value={email}
            readOnly
            placeholder="Your email address"
            className={cn(providerAuthInputClass(), "bg-[#F8FAFC]")}
          />
        </ProviderAuthField>

        <ProviderAuthField label="New Password" error={errors.password}>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your new password"
            className={cn(providerAuthInputClass(errors.password), "pr-11")}
          />
        </ProviderAuthField>

        <ProviderAuthField label="Confirm New Password" error={errors.confirm}>
          <PasswordInput
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Your Password"
            className={cn(providerAuthInputClass(errors.confirm), "pr-11")}
          />
        </ProviderAuthField>
      </form>
    </ProviderAuthResponsive>
  );
}

export default function ProviderResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
