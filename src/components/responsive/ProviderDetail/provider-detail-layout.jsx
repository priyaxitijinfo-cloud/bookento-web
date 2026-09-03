"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import {
  DoctorProfileMobileHeader,
  DoctorProfileMobileHeroHeader,
  DoctorProfileSidebar,
  DoctorProfileSidebarFixed,
} from "@/components/provider-booking/doctor-profile-sidebar";
import { ProviderAboutPanel } from "@/components/provider-booking/provider-about-panel";
import { ProviderBookingSummaryBar } from "@/components/provider-booking/provider-booking-summary";
import { ProviderGalleryPanel } from "@/components/provider-booking/provider-gallery-panel";
import { ProviderPackagesPanel } from "@/components/provider-booking/provider-packages-panel";
import { ProviderReviewsPanel } from "@/components/provider-booking/provider-reviews-panel";
import { ProviderServicesPanel } from "@/components/provider-booking/provider-services-panel";
import { ProviderVideosPanel } from "@/components/provider-booking/provider-videos-panel";
import {
  ProfileTabs,
  TabPanelHeader,
  PROFILE_TAB_PANEL_META,
} from "@/components/provider-booking/shared";
import { BlockDoctorModal } from "@/components/provider-booking/block-doctor-modal";
import { ReportDoctorModal } from "@/components/provider-booking/report-doctor-modal";
import { ServicesSheet } from "@/components/provider-booking/services-sheet";
import { UserBottomNav } from "@/components/layout/user-nav";

import { cn } from "@/lib/utils";

export function ProfileDesktopBreadcrumb({ href, backLabel, currentLabel }) {
  return (
    <DesktopBreadcrumbBar
      backHref={href}
      backLabel={backLabel}
      currentLabel={currentLabel}
    />
  );
}

export function ProfileMainPanel({
  tabs,
  activeTab,
  onTabChange,
  children,
  showBookingFooter,
  provider,
  services,
  categorySlug,
  mobileFooterClassName,
  fillViewport = false,
  mobileSheet = false,
}) {
  return (
    <div
      className={cn(
        "min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col",
        mobileSheet && "flex min-h-0 flex-1 flex-col",
        fillViewport && "h-full min-h-0",
      )}
    >
      <div
        className={cn(
          "bg-background flex min-h-0 flex-1 flex-col",
          mobileSheet
            ? "overflow-hidden"
            : "border-border/60 shadow-card rounded-xl border lg:max-h-full",
          fillViewport && "h-full",
        )}
      >
        <div className="shrink-0">
          <ProfileTabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={onTabChange}
            variant={mobileSheet ? "sheet" : "default"}
          />
        </div>

        <div
          className={cn(
            "scrollbar-hide flex-1 overflow-y-auto",
            mobileSheet ? "min-h-0 px-4 pt-1" : "p-5 md:p-7",
            mobileSheet && showBookingFooter ? "pb-28" : mobileSheet ? "pb-4" : "",
            fillViewport ? "min-h-0" : mobileSheet ? "" : "min-h-[560px] lg:min-h-0",
          )}
        >
          {!mobileSheet && PROFILE_TAB_PANEL_META[activeTab] ? (
            <TabPanelHeader
              title={PROFILE_TAB_PANEL_META[activeTab].title}
              description={PROFILE_TAB_PANEL_META[activeTab].description}
            />
          ) : null}
          {children}
        </div>

        {showBookingFooter && (
          <div className="border-border/60 hidden shrink-0 border-t lg:block">
            <ProviderBookingSummaryBar
              provider={provider}
              services={services}
              categorySlug={categorySlug}
              attachedFooter
            />
          </div>
        )}
      </div>

      {showBookingFooter && (
        <ProviderBookingSummaryBar
          provider={provider}
          services={services}
          categorySlug={categorySlug}
          flat
          fullBleed={mobileSheet}
          className={mobileFooterClassName ?? "lg:hidden"}
        />
      )}
    </div>
  );
}

export function ProviderTabPanels({
  activeTab,
  provider,
  categorySlug,
  services,
  packages,
  gallery,
  aboutParagraphs,
  setServicesOpen,
  mobileSheet = false,
}) {
  return (
    <>
      {activeTab === "services" && (
        <ProviderServicesPanel
          services={services}
          onSeeAllServices={() => setServicesOpen(true)}
        />
      )}
      {activeTab === "packages" && (
        <ProviderPackagesPanel
          providerId={provider.id}
          provider={provider}
          categorySlug={categorySlug}
          packages={packages}
        />
      )}
      {activeTab === "about" && (
        <ProviderAboutPanel paragraphs={aboutParagraphs} mobile={mobileSheet} />
      )}
      {activeTab === "gallery" && (
        <ProviderGalleryPanel items={gallery} variant="showcase" />
      )}
      {activeTab === "videos" && (
        <ProviderVideosPanel provider={provider} categorySlug={categorySlug} />
      )}
      {activeTab === "reviews" && (
        <ProviderReviewsPanel provider={provider} mobile={mobileSheet} />
      )}
    </>
  );
}

export function ProviderDetailModals({
  servicesOpen,
  setServicesOpen,
  services,
  blockOpen,
  setBlockOpen,
  reportOpen,
  setReportOpen,
  doctorName,
  onConfirmBlock,
  onSubmitReport,
}) {
  return (
    <>
      <ServicesSheet
        open={servicesOpen}
        onClose={() => setServicesOpen(false)}
        services={services}
      />
      <BlockDoctorModal
        open={blockOpen}
        onClose={() => setBlockOpen(false)}
        doctorName={doctorName}
        onConfirm={onConfirmBlock}
      />
      <ReportDoctorModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={onSubmitReport}
      />
    </>
  );
}

export {
  DoctorProfileMobileHeader,
  DoctorProfileMobileHeroHeader,
  DoctorProfileSidebar,
  DoctorProfileSidebarFixed,
  HomeHeader,
  UserBottomNav,
};
