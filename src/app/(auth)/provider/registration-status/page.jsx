"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { PageLoader } from "@/components/ui/skeleton";
import {
  ProviderAuthResponsive,
  ProviderContinueButton,
} from "@/features/auth/components/provider-auth-shell";
import { ProviderRegistrationStatusView } from "@/features/auth/components/provider-registration-status-view";
import { ROUTES } from "@/constants/routes.constants";

function RegistrationStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rejected = searchParams.get("status") === "rejected";

  return (
    <ProviderAuthResponsive
      wide
      title="Request Send Successfully"
      subtitle="Your provider request send successfully for admin wait 48 hours to approve request."
      headline={rejected ? "Application update" : "Application received"}
      copy={
        rejected
          ? "Your request was reviewed. See the rejection reason below and try again with valid documents."
          : "Our team is reviewing your documents. You'll get an email once approved."
      }
      footer={
        <ProviderContinueButton onClick={() => router.push(ROUTES.PROVIDER_LOGIN)}>
          Back to Login
        </ProviderContinueButton>
      }
    >
      <ProviderRegistrationStatusView rejected={rejected} />
    </ProviderAuthResponsive>
  );
}

export default function ProviderRegistrationStatusPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RegistrationStatusContent />
    </Suspense>
  );
}
