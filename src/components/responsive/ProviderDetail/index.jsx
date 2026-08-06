"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  BriefcaseMedical,
  ImageIcon,
  Info,
  LayoutGrid,
  Star,
  Video,
} from "lucide-react";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { EmptyState } from "@/components/shared/empty-state";
import { getCategoryBookingData } from "@/constants/category-booking.constants";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { categoryListingRoute, ROUTES } from "@/constants/routes.constants";
import { BACK_FROM_SOURCES } from "@/lib/navigation/back-navigation";
import { getHomeCategoryBySlug, getCategoryProviderDisplayName } from "@/constants/home-categories";
import { getGalleryByProvider } from "@/mock/gallery";
import { getPackagesByProvider } from "@/mock/packages";
import { getProviderById } from "@/mock/providers";
import { getServicesByProvider } from "@/mock/services";
import { timeSlots } from "@/mock/appointments";
import { useBookingStore, useSavedProvidersStore } from "@/store";
import { getLocalDateKey } from "@/utils/format.utils";

import { ProviderDetailDesktop } from "./ProviderDetailDesktop";
import { ProviderDetailMobile } from "./ProviderDetailMobile";
import { ProviderDetailTablet } from "./ProviderDetailTablet";

const DOCTOR_TABS = [
  { id: "services", label: "Services", icon: BriefcaseMedical },
  { id: "packages", label: "Packages", icon: LayoutGrid },
  { id: "about", label: "About", icon: Info },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "videos", label: "Videos", icon: Video },
  { id: "reviews", label: "Reviews", icon: Star },
];

const GENERIC_TABS = [
  { id: "services", label: "Services" },
  { id: "packages", label: "Packages" },
  { id: "about", label: "About" },
  { id: "gallery", label: "Gallery" },
];

export function ProviderDetailResponsive() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const category = categorySlug ? getHomeCategoryBySlug(categorySlug) : null;
  const isCategoryFlow = Boolean(category);
  const listingName = searchParams.get("name");
  const listingSpecialty = searchParams.get("specialty");
  const listingAvatar = searchParams.get("avatar");

  const provider = getProviderById(id);
  const displayProvider = provider && isCategoryFlow
    ? {
        ...provider,
        businessName: listingName || provider.businessName,
        specialty: listingSpecialty || provider.specialty,
        avatar: listingAvatar || provider.avatar,
      }
    : provider;

  const validTabIds = useMemo(
    () => (isCategoryFlow ? DOCTOR_TABS : GENERIC_TABS).map((tab) => tab.id),
    [isCategoryFlow],
  );

  const activeTab = useMemo(() => {
    if (searchParams.get("reel") && validTabIds.includes("videos")) {
      return "videos";
    }

    const tabParam = searchParams.get("tab");
    if (tabParam && validTabIds.includes(tabParam)) {
      return tabParam;
    }

    return "services";
  }, [searchParams, validTabIds]);

  const handleTabChange = (tabId) => {
    const params = new URLSearchParams(searchParams.toString());

    if (tabId === "services") {
      params.delete("tab");
    } else {
      params.set("tab", tabId);
    }

    if (tabId !== "videos") {
      params.delete("reel");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const fromSaved = searchParams.get("from") === "saved";
  const providerBackHref = fromSaved ? ROUTES.SAVED : ROUTES.HOME;
  const toggleSaved = useSavedProvidersStore((state) => state.toggleSaved);
  const isProviderSaved = useSavedProvidersStore((state) =>
    displayProvider?.id ? state.savedIds.includes(displayProvider.id) : false,
  );
  const [servicesOpen, setServicesOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const initializedRef = useRef(false);

  const categoryBookingData = useMemo(() => {
    if (!isCategoryFlow) return null;
    return getCategoryBookingData(categorySlug, listingName || provider?.businessName);
  }, [isCategoryFlow, categorySlug, listingName, provider?.businessName]);

  const services = useMemo(() => {
    if (categoryBookingData) return categoryBookingData.services;
    return getServicesByProvider(id).slice(0, 6).map((service) => ({
      id: service.id,
      name: service.name,
      duration: service.duration,
      price: service.price,
      originalPrice: service.price + Math.round(service.price * 0.2),
    }));
  }, [id, categoryBookingData]);

  const packages = useMemo(() => {
    if (categoryBookingData) return categoryBookingData.packages;
    if (provider) return getPackagesByProvider(provider.id);
    return [];
  }, [categoryBookingData, provider]);

  const gallery = useMemo(() => {
    if (categoryBookingData) return categoryBookingData.gallery;
    if (provider) return getGalleryByProvider(provider.id);
    return [];
  }, [categoryBookingData, provider]);

  useEffect(() => {
    if (!displayProvider?.id || initializedRef.current) return;

    initializedRef.current = true;

    const { setProviderId, setVisitType, setBranchId, setScheduledDate, setScheduledTime, setServices } = useBookingStore.getState();

    setProviderId(displayProvider.id);
    setVisitType("in_clinic");
    setBranchId(PROVIDER_BRANCHES[0].id);
    setScheduledDate(getLocalDateKey(new Date()));
    setScheduledTime(timeSlots.find((slot) => slot.available)?.time || "11:30 AM");

    if (services[1]) setServices([services[1].id]);
    else if (services[0]) setServices([services[0].id]);
  }, [displayProvider?.id, services]);

  const handleToggleSaved = () => {
    if (!displayProvider?.id) return;

    const isNowSaved = toggleSaved(displayProvider.id);
    toast.success(isNowSaved ? "Saved to favorites" : "Removed from saved");
  };

  const handleConfirmBlock = () => {
    setBlockOpen(false);
    toast.success("Doctor blocked successfully");
  };

  const handleSubmitReport = () => {
    setReportOpen(false);
    toast.success("Report submitted. Our team will review it shortly.");
  };

  if (!displayProvider) {
    return (
      <div className="flex min-h-dvh items-center justify-center p-6">
        <EmptyState
          title="Provider not found"
          description="This provider may have been removed."
          actionLabel="Browse providers"
          onAction={() => { window.location.href = ROUTES.PROVIDERS; }}
        />
      </div>
    );
  }

  const backFromSource = searchParams.get("backFrom");
  const backFromConfig = backFromSource ? BACK_FROM_SOURCES[backFromSource] : null;

  const tabs = isCategoryFlow ? DOCTOR_TABS : GENERIC_TABS;
  const profileBackHref = backFromConfig
    ? backFromConfig.href
    : isCategoryFlow
      ? categoryListingRoute(categorySlug)
      : providerBackHref;
  const profileBackLabel = backFromConfig
    ? `Back to ${backFromConfig.label}`
    : isCategoryFlow
      ? (categorySlug === "doctor" ? "Back to doctors" : `Back to ${category.name.toLowerCase()}`)
      : (fromSaved ? "Back to saved" : "Back to home");
  const profileLabel = isCategoryFlow
    ? (categorySlug === "doctor" ? "Doctor Profile" : `${category.name} Profile`)
    : displayProvider.businessName;
  const aboutParagraphs = categoryBookingData?.aboutParagraphs ?? [
    displayProvider.description,
    `${displayProvider.yearsOfExperience}+ years of experience · ${displayProvider.totalBookings}+ completed bookings · ${displayProvider.phone}`,
  ];
  const doctorDisplayName = getCategoryProviderDisplayName(
    displayProvider.businessName,
    isCategoryFlow ? categorySlug : null,
  );

  const sharedProps = {
    provider: displayProvider,
    categorySlug: isCategoryFlow ? categorySlug : null,
    backHref: profileBackHref,
    backLabel: profileBackLabel,
    profileLabel,
    saved: isProviderSaved,
    onToggleSaved: handleToggleSaved,
    onBlockClick: () => setBlockOpen(true),
    onReportClick: () => setReportOpen(true),
    tabs,
    activeTab,
    onTabChange: handleTabChange,
    services,
    packages,
    gallery,
    aboutParagraphs,
    servicesOpen,
    setServicesOpen,
    blockOpen,
    setBlockOpen,
    reportOpen,
    setReportOpen,
    onConfirmBlock: handleConfirmBlock,
    onSubmitReport: handleSubmitReport,
    doctorDisplayName,
  };

  return (
    <ResponsiveView
      mobile={<ProviderDetailMobile {...sharedProps} />}
      tablet={<ProviderDetailTablet {...sharedProps} />}
      desktop={<ProviderDetailDesktop {...sharedProps} />}
    />
  );
}

export default ProviderDetailResponsive;
