"use client";

import { HomeHeader } from "@/components/home/home-header";
import { DesktopBreadcrumbBar } from "@/components/layout/desktop-breadcrumb-bar";
import {
  DoctorProfileMobileHeader,
  DoctorProfileSidebarFixed,
} from "@/components/provider-booking/doctor-profile-sidebar";
import { ProviderAboutPanel } from "@/components/provider-booking/provider-about-panel";
import { ProviderBookingSummaryBar } from "@/components/provider-booking/provider-booking-summary";
import { ProviderGalleryPanel } from "@/components/provider-booking/provider-gallery-panel";
import { ProviderPackagesPanel } from "@/components/provider-booking/provider-packages-panel";
import { ProviderReviewsPanel } from "@/components/provider-booking/provider-reviews-panel";
import { ProviderServicesPanel } from "@/components/provider-booking/provider-services-panel";
import { ProviderVideosPanel } from "@/components/provider-booking/provider-videos-panel";
import { ProfileTabs } from "@/components/provider-booking/shared";
import { BlockDoctorModal } from "@/components/provider-booking/block-doctor-modal";
import { ReportDoctorModal } from "@/components/provider-booking/report-doctor-modal";
import { ServicesSheet } from "@/components/provider-booking/services-sheet";
import { UserBottomNav } from "@/components/layout/user-nav";

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
}) {
  return (
    <div className="min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-border/60 bg-background shadow-card lg:max-h-full">
        <div className="shrink-0">
          <ProfileTabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
        </div>

        <div className="scrollbar-hide min-h-[560px] flex-1 overflow-y-auto p-5 md:p-7 lg:min-h-0">
          {children}
        </div>

        {showBookingFooter && (
          <div className="hidden shrink-0 border-t border-border/60 lg:block">
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
        <ProviderAboutPanel provider={provider} paragraphs={aboutParagraphs} />
      )}
      {activeTab === "gallery" && (
        <ProviderGalleryPanel items={gallery} showHeader variant="showcase" />
      )}
      {activeTab === "videos" && (
        <ProviderVideosPanel provider={provider} categorySlug={categorySlug} />
      )}
      {activeTab === "reviews" && (
        <ProviderReviewsPanel provider={provider} />
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
      <ServicesSheet open={servicesOpen} onClose={() => setServicesOpen(false)} services={services} />
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

export { DoctorProfileMobileHeader, DoctorProfileSidebarFixed, HomeHeader, UserBottomNav };
