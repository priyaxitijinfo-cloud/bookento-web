"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";

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
    const e2 = {};
    if (!password || password.length < 8) e2.password = "Password must be at least 8 characters";
    if (password !== confirm) e2.confirm = "Passwords do not match";
    setErrors(e2);
    if (Object.keys(e2).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("Password reset successfully");
    router.push(ROUTES.PROVIDER_LOGIN);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <Link href={ROUTES.PROVIDER_VERIFY_OTP} className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="gradient-brand-text text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">
          Create a new password{email ? ` for ${email}` : ""}
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <KeyRound className="size-6" />
          </div>
          <CardTitle className="text-center">New Password</CardTitle>
          <CardDescription className="text-center">Use at least 8 characters with mixed case</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="New Password" required error={errors.password}>
              <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormField>
            <FormField label="Confirm Password" required error={errors.confirm}>
              <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </FormField>
            <Button type="submit" className="w-full" loading={loading}>
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-center text-sm">
        Remember your password? <Link href={ROUTES.PROVIDER_LOGIN} className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default function ProviderResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
