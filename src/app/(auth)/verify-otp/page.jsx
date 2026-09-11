"use client";

import { Suspense } from "react";

import { UserOtpForm } from "@/features/auth/components/user-otp-form";
import { PageLoader } from "@/components/ui/skeleton";

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <UserOtpForm />
    </Suspense>
  );
}
