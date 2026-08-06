"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { ResponsiveView } from "@/components/responsive/primitives/ResponsiveView";
import { PACKAGE_THEMES } from "@/constants/doctor-booking.constants";
import { getCategoryPackageById } from "@/constants/category-booking.constants";
import { PROVIDER_BRANCHES } from "@/constants/provider-branches";
import { getHomeCategoryBySlug } from "@/constants/home-categories";
import { timeSlots } from "@/mock/appointments";
import { getPackageById } from "@/mock/packages";
import { getProviderById } from "@/mock/providers";
import { useBookingStore } from "@/store";
import { getLocalDateKey } from "@/utils/format.utils";
import { sharePageLink } from "@/utils/share.utils";

import { getPackageDateRange } from "./package-detail-parts";
import { PackageDetailDesktop } from "./PackageDetailDesktop";
import { PackageDetailMobile } from "./PackageDetailMobile";
import { PackageDetailTablet } from "./PackageDetailTablet";

export function PackageDetailResponsive() {
  const { id, packageId } = useParams();
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("from");
  const isCategoryFlow = Boolean(categorySlug && getHomeCategoryBySlug(categorySlug));

  const provider = getProviderById(id);
  const resolvedPackageId = useMemo(() => {
    const categoryPackage = isCategoryFlow ? getCategoryPackageById(categorySlug, packageId) : null;
    const mockPackage = getPackageById(packageId);
    const resolved = categoryPackage ?? (mockPackage && {
      ...mockPackage,
      features: [`${mockPackage.serviceIds.length} included services`, "Priority support", "Flexible scheduling"],
      theme: "blue",
    });

    return resolved?.id ? String(resolved.id) : null;
  }, [isCategoryFlow, categorySlug, packageId]);

  const pkg = useMemo(() => {
    if (!resolvedPackageId) return null;
    const categoryPackage = isCategoryFlow ? getCategoryPackageById(categorySlug, packageId) : null;
    const mockPackage = getPackageById(packageId);

    return categoryPackage ?? (mockPackage && {
      ...mockPackage,
      features: [`${mockPackage.serviceIds.length} included services`, "Priority support", "Flexible scheduling"],
      theme: "blue",
    });
  }, [isCategoryFlow, categorySlug, packageId, resolvedPackageId]);

  const visitType = useBookingStore((state) => state.draft.visitType);
  const scheduledDate = useBookingStore((state) => state.draft.scheduledDate);
  const scheduledTime = useBookingStore((state) => state.draft.scheduledTime);
  const setProviderId = useBookingStore((state) => state.setProviderId);
  const setVisitType = useBookingStore((state) => state.setVisitType);
  const setPackageId = useBookingStore((state) => state.setPackageId);
  const setScheduledDate = useBookingStore((state) => state.setScheduledDate);
  const setScheduledTime = useBookingStore((state) => state.setScheduledTime);
  const setBranchId = useBookingStore((state) => state.setBranchId);
  const [saved, setSaved] = useState(false);
  const [monthAnchorDate, setMonthAnchorDate] = useState(() => new Date());
  const [dateScrollEdges, setDateScrollEdges] = useState({ canPrev: false, canNext: true });
  const dateScrollRef = useRef(null);

  const dates = useMemo(() => getPackageDateRange(42, 0), []);
  const monthLabel = monthAnchorDate
    ? `${monthAnchorDate.toLocaleDateString("en", { month: "short" })}, ${monthAnchorDate.getFullYear()}`
    : "";

  const syncDateScrollState = useCallback(() => {
    const el = dateScrollRef.current;
    if (!el) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    if (el.scrollLeft > maxScroll) {
      el.scrollLeft = maxScroll;
    }

    setDateScrollEdges((current) => {
      const next = {
        canPrev: el.scrollLeft > 1,
        canNext: el.scrollLeft < maxScroll - 1,
      };

      if (current.canPrev === next.canPrev && current.canNext === next.canNext) {
        return current;
      }

      return next;
    });

    const track = el.firstElementChild;
    if (!(track instanceof HTMLElement)) return;

    const children = Array.from(track.children);
    const anchor = el.scrollLeft + 8;
    const visibleChild = children.find((child) => child.offsetLeft + child.offsetWidth > anchor);
    const index = visibleChild ? children.indexOf(visibleChild) : 0;
    const visibleDate = dates[index];

    if (visibleDate) {
      setMonthAnchorDate((current) => {
        if (getLocalDateKey(current) === getLocalDateKey(visibleDate)) {
          return current;
        }

        return visibleDate;
      });
    }
  }, [dates]);

  const scrollDatesByPage = useCallback((direction) => {
    const el = dateScrollRef.current;
    if (!el) return;

    const track = el.firstElementChild;
    const firstCard = track?.firstElementChild;
    const cardStep = firstCard instanceof HTMLElement
      ? firstCard.offsetWidth + (el.clientWidth >= 768 ? 10 : 8)
      : 220;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const nextScroll = Math.max(0, Math.min(el.scrollLeft + direction * cardStep * 4, maxScroll));
    el.scrollTo({ left: nextScroll, behavior: "smooth" });
  }, []);

  const handlePrevDates = () => scrollDatesByPage(-1);
  const handleNextDates = () => scrollDatesByPage(1);
  const handleDateScroll = () => syncDateScrollState();

  useEffect(() => {
    if (!provider?.id || !resolvedPackageId) return;

    const { draft } = useBookingStore.getState();

    setProviderId(provider.id);
    setPackageId(resolvedPackageId);

    if (!draft.visitType) setVisitType("in_clinic");
    if (!draft.scheduledDate) setScheduledDate(getLocalDateKey(new Date()));
    if (!draft.scheduledTime) setScheduledTime(timeSlots[2]?.time || "11:00 AM");
    if (!draft.branchId) setBranchId(PROVIDER_BRANCHES[0].id);
  }, [
    provider?.id,
    resolvedPackageId,
    setProviderId,
    setPackageId,
    setVisitType,
    setScheduledDate,
    setScheduledTime,
    setBranchId,
  ]);

  useEffect(() => {
    syncDateScrollState();
  }, [syncDateScrollState]);

  useEffect(() => {
    const onResize = () => syncDateScrollState();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncDateScrollState]);

  useEffect(() => {
    const el = dateScrollRef.current;
    if (!el) return;

    const onWheel = (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      el.scrollLeft = Math.max(0, Math.min(el.scrollLeft + event.deltaY, maxScroll));
      event.preventDefault();
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const el = dateScrollRef.current;
    if (!el || !scheduledDate) return;

    const track = el.firstElementChild;
    if (!(track instanceof HTMLElement)) return;

    const selectedIndex = dates.findIndex((date) => getLocalDateKey(date) === scheduledDate);
    if (selectedIndex < 0) return;

    const selectedButton = track.children[selectedIndex];
    if (!(selectedButton instanceof HTMLElement)) return;

    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const targetLeft = selectedButton.offsetLeft - (el.clientWidth - selectedButton.offsetWidth) / 2;
    el.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxScroll)),
      behavior: "smooth",
    });
  }, [dates, scheduledDate]);

  if (!provider || !pkg) {
    return <div className="flex min-h-dvh items-center justify-center">Package not found</div>;
  }

  const flowProvider = {
    ...provider,
    businessName: searchParams.get("name") || provider.businessName,
    specialty: searchParams.get("specialty") || provider.specialty,
    avatar: searchParams.get("avatar") || provider.avatar,
  };

  const theme = PACKAGE_THEMES[pkg.theme || "blue"];

  const handleShare = async () => {
    const result = await sharePageLink({
      title: pkg.name,
      text: `${pkg.name} — ${flowProvider.businessName}`,
    });

    if (result === "copied") {
      toast.success("Link copied!");
      return;
    }

    if (result === "failed") {
      toast.error("Could not share link");
    }
  };

  const onToggleSaved = () => {
    setSaved((current) => !current);
    toast.success(saved ? "Removed from saved" : "Saved to favorites");
  };

  const sharedProps = {
    pkg,
    theme,
    flowProvider,
    categorySlug: isCategoryFlow ? categorySlug : null,
    visitType,
    setVisitType,
    scheduledDate,
    setScheduledDate,
    scheduledTime,
    setScheduledTime,
    saved,
    onToggleSaved,
    onShare: handleShare,
    dates,
    monthLabel,
    dateScrollRef,
    handleDateScroll,
    handlePrevDates,
    handleNextDates,
    dateScrollEdges,
  };

  return (
    <ResponsiveView
      mobile={<PackageDetailMobile {...sharedProps} />}
      tablet={<PackageDetailTablet {...sharedProps} />}
      desktop={<PackageDetailDesktop {...sharedProps} />}
    />
  );
}

export default PackageDetailResponsive;
