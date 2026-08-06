"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/label";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (password.length < 8) e.password = "Password must be at least 8 characters";
    if (password !== confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Password reset successfully!");
    router.push(ROUTES.USER_LOGIN);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="gradient-brand-text text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">
          Create a new password for {email || "your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="New Password" required error={errors.password}>
          <PasswordInput
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
        </FormField>

        <FormField label="Confirm Password" required error={errors.confirmPassword}>
          <PasswordInput
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </FormField>

        <Button type="submit" className="w-full" loading={loading}>
          Reset Password
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        <Link href={ROUTES.USER_LOGIN} className="text-primary font-medium hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
