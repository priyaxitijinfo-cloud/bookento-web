"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("OTP sent to your email");
    router.push(`${ROUTES.PROVIDER_VERIFY_OTP}?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <Link href={ROUTES.PROVIDER_LOGIN} className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="size-4" /> Back to login
        </Link>
        <h1 className="gradient-brand-text text-3xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground mt-2">We&apos;ll send a verification code to reset your password</p>
      </div>

      <Card>
        <CardHeader>
          <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <Mail className="size-6" />
          </div>
          <CardTitle className="text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">Enter your provider account email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Email" required error={error}>
              <Input
                type="email"
                placeholder="provider@business.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormField>
            <Button type="submit" className="w-full" loading={loading}>
              Send Verification Code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
