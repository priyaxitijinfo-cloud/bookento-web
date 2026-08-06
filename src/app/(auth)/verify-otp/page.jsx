"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageLoader } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes.constants";

const OTP_LENGTH = 6;

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email";
  const inputRefs = useRef([]);

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      toast.error("Please enter the complete OTP");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("OTP verified!");
    router.push(`${ROUTES.RESET_PASSWORD}?email=${encodeURIComponent(email)}&otp=${code}`);
  };

  const handleResend = async () => {
    setCountdown(60);
    toast.success("New OTP sent!");
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="gradient-brand-text text-3xl font-bold">Verify OTP</h1>
        <p className="text-muted-foreground mt-2">
          Enter the 6-digit code sent to <span className="text-foreground font-medium">{email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2">
          {otp.map((digit, i) => (
            <Input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="size-12 text-center text-lg font-bold"
            />
          ))}
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          Verify Code
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        {countdown > 0 ? (
          <>Resend code in <span className="text-foreground font-medium">{countdown}s</span></>
        ) : (
          <button type="button" onClick={handleResend} className="text-primary font-medium hover:underline">
            Resend code
          </button>
        )}
      </p>

      <p className="text-muted-foreground text-center text-sm">
        <Link href={ROUTES.FORGOT_PASSWORD} className="text-primary font-medium hover:underline">
          Change email
        </Link>
      </p>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <VerifyOtpForm />
    </Suspense>
  );
}
