"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { getProviderById } from "@/mock/providers";
import { useBookingStore } from "@/store";

import { PaymentDesktop } from "./PaymentDesktop";
import { PaymentMobile } from "./PaymentMobile";
import { PaymentTablet } from "./PaymentTablet";

export function PaymentResponsive() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const isCategoryFlow = Boolean(categorySlug && getHomeCategoryBySlug(categorySlug));
  const clearComplete = useBookingStore((state) => state.clearComplete);

  useEffect(() => {
    clearComplete();
  }, [clearComplete]);

  const provider = getProviderById(id);

  if (!provider) {
    return <div className="flex min-h-dvh items-center justify-center">Payment details not found</div>;
  }

  const flowProvider = {
    ...provider,
    businessName: searchParams.get("name") || provider.businessName,
    specialty: searchParams.get("specialty") || provider.specialty,
    avatar: searchParams.get("avatar") || provider.avatar,
  };

  const resolvedCategorySlug = isCategoryFlow ? categorySlug : null;
  const sharedProps = { provider: flowProvider, categorySlug: resolvedCategorySlug };

  return (
    <ResponsiveView
      mobile={<PaymentMobile {...sharedProps} />}
      tablet={<PaymentTablet {...sharedProps} />}
      desktop={<PaymentDesktop {...sharedProps} />}
    />
  );
}

export default PaymentResponsive;
