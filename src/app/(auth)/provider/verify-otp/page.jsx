"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ArrowLeft, Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Enter 6-digit OTP");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    toast.success("OTP verified");
    router.push(`${ROUTES.PROVIDER_RESET_PASSWORD}?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <Link href={ROUTES.PROVIDER_FORGOT_PASSWORD} className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1 text-sm">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <h1 className="gradient-brand-text text-3xl font-bold">Verify OTP</h1>
        <p className="text-muted-foreground mt-2">
          Enter the code sent to <strong>{email}</strong>
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="bg-primary/10 text-primary mx-auto mb-2 flex size-12 items-center justify-center rounded-full">
            <Shield className="size-6" />
          </div>
          <CardTitle className="text-center">Verification Code</CardTitle>
          <CardDescription className="text-center">Code expires in 10 minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="OTP" required error={error}>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em]"
                maxLength={6}
              />
            </FormField>
            <Button type="submit" className="w-full" loading={loading}>
              Verify & Continue
            </Button>
            <Button variant="link" type="button" className="w-full" onClick={() => toast.info("OTP resent")}>
              Resend code
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProviderVerifyOtpPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
