"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { PasswordInput } from "@/components/forms/password-input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes.constants";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    toast.success("OTP sent to your email");
    router.push(`${ROUTES.VERIFY_OTP}?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="gradient-brand-text text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">
          Enter your email and we&apos;ll send you a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Email" required error={error}>
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
        </FormField>
        <Button type="submit" className="w-full" loading={loading}>
          Send Verification Code
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Remember your password?{" "}
        <Link href={ROUTES.USER_LOGIN} className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
