"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { toast } from "sonner";

import { PageLoader } from "@/components/ui/skeleton";
import {
  ProviderAuthResponsive,
  ProviderContinueButton,
} from "@/features/auth/components/provider-auth-shell";
import { ProviderRegistrationStatusView } from "@/features/auth/components/provider-registration-status-view";
import { ROUTES } from "@/constants/routes.constants";
import { PROVIDER_STATUS } from "@/constants/status.constants";
import { useProviderAuthStore } from "@/store";

function RegistrationStatusContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    verificationApplication,
    updateVerificationStatus,
    enterProviderHome,
    logout,
    isLoading,
  } = useProviderAuthStore();

  const statusParam = searchParams.get("status");
  const status =
    statusParam === PROVIDER_STATUS.REJECTED ||
    statusParam === PROVIDER_STATUS.APPROVED ||
    statusParam === PROVIDER_STATUS.PENDING
      ? statusParam
      : verificationApplication?.status || PROVIDER_STATUS.PENDING;

  useEffect(() => {
    if (
      statusParam === PROVIDER_STATUS.REJECTED ||
      statusParam === PROVIDER_STATUS.APPROVED ||
      statusParam === PROVIDER_STATUS.PENDING
    ) {
      updateVerificationStatus(statusParam);
    }
  }, [statusParam, updateVerificationStatus]);

  const isRejected = status === PROVIDER_STATUS.REJECTED;
  const isApproved = status === PROVIDER_STATUS.APPROVED;

  const titles = isRejected
    ? {
        title: "Documents Rejected",
        subtitle:
          "Your verification documents were not approved. Please re-submit valid documents.",
        headline: "Application update",
        copy: "See the rejection reason below, then re-submit your documents.",
      }
    : isApproved
      ? {
          title: "Documents Verified!",
          subtitle:
            "Your provider account has been approved. Continue to your dashboard.",
          headline: "You're approved",
          copy: "Manage appointments, earnings, and your business profile from home.",
        }
      : {
          title: "Request Send Successfully",
          subtitle:
            "Your provider request send successfully for admin wait 48 hours to approve request.",
          headline: "Application received",
          copy: "Our team is reviewing your documents. You can continue to your provider home.",
        };

  const handleGoToHome = async () => {
    const result = await enterProviderHome();
    if (!result.success) {
      toast.error("Could not open provider home. Try again.");
      return;
    }
    toast.success("Welcome to Bookento Pro");
    router.push(ROUTES.PROVIDER_HOME);
  };

  const handleResubmit = async () => {
    await logout();
    router.push(`${ROUTES.PROVIDER_REGISTER}?resubmit=1`);
  };

  return (
    <ProviderAuthResponsive
      wide
      title={titles.title}
      subtitle={titles.subtitle}
      headline={titles.headline}
      copy={titles.copy}
      footer={
        <div className="flex w-full flex-col gap-2.5">
          {isRejected ? (
            <ProviderContinueButton onClick={handleResubmit}>
              Re-submit Documents
            </ProviderContinueButton>
          ) : (
            <ProviderContinueButton onClick={handleGoToHome} disabled={isLoading}>
              {isLoading ? "Opening..." : "Go to Home"}
            </ProviderContinueButton>
          )}
        </div>
      }
    >
      <ProviderRegistrationStatusView
        status={status}
        avatarSrc={verificationApplication?.avatarSrc}
        name={verificationApplication?.name}
        businessName={verificationApplication?.businessName}
        category={verificationApplication?.category}
        requestDate={verificationApplication?.requestDate}
        requestTime={verificationApplication?.requestTime}
        requestId={verificationApplication?.requestId}
        rejectionReason={verificationApplication?.rejectionReason}
      />
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
