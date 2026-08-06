"use client";

import { useParams, useSearchParams } from "next/navigation";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { getCategoryPackageById } from "@/constants/category-booking.constants";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { getPackageById } from "@/mock/packages";
import { getProviderById } from "@/mock/providers";

import { PackagePaymentDesktop } from "./PackagePaymentDesktop";
import { PackagePaymentMobile } from "./PackagePaymentMobile";
import { PackagePaymentTablet } from "./PackagePaymentTablet";

export function PackagePaymentResponsive() {
  const { id, packageId } = useParams();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const isCategoryFlow = Boolean(categorySlug && getHomeCategoryBySlug(categorySlug));

  const provider = getProviderById(id);
  const categoryPackage = isCategoryFlow ? getCategoryPackageById(categorySlug, packageId) : null;
  const mockPackage = getPackageById(packageId);
  const pkg = categoryPackage
    ?? (mockPackage && {
        ...mockPackage,
        features: [`${mockPackage.serviceIds.length} included services`, "Priority support", "Flexible scheduling"],
        theme: "blue",
      });

  if (!provider || !pkg) {
    return <div className="flex min-h-dvh items-center justify-center">Payment details not found</div>;
  }

  const flowProvider = {
    ...provider,
    businessName: searchParams.get("name") || provider.businessName,
    specialty: searchParams.get("specialty") || provider.specialty,
    avatar: searchParams.get("avatar") || provider.avatar,
  };

  const sharedProps = {
    provider: flowProvider,
    categorySlug: isCategoryFlow ? categorySlug : null,
    bookingPackage: pkg,
  };

  return (
    <ResponsiveView
      mobile={<PackagePaymentMobile {...sharedProps} />}
      tablet={<PackagePaymentTablet {...sharedProps} />}
      desktop={<PackagePaymentDesktop {...sharedProps} />}
    />
  );
}

export default PackagePaymentResponsive;
