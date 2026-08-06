"use client";

import {
  DoctorProfileMobileHeader,
  HomeHeader,
  ProfileDesktopBreadcrumb,
  ProfileMainPanel,
  ProviderDetailModals,
  ProviderTabPanels,
} from "./provider-detail-layout";

export function ProviderDetailTablet({
  provider,
  categorySlug,
  backHref,
  backLabel,
  profileLabel,
  saved,
  onToggleSaved,
  onBlockClick,
  onReportClick,
  tabs,
  activeTab,
  onTabChange,
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
  onConfirmBlock,
  onSubmitReport,
  doctorDisplayName,
}) {
  const showBookingFooter = activeTab === "services";

  return (
    <div className="bg-surface-page min-h-dvh pb-32">
      <div className="hidden shrink-0 md:block">
        <HomeHeader />
        <ProfileDesktopBreadcrumb
          href={backHref}
          backLabel={backLabel}
          currentLabel={profileLabel}
        />
      </div>

      <div className="mx-auto w-full max-w-5xl px-6 py-6">
        <DoctorProfileMobileHeader
          provider={provider}
          categorySlug={categorySlug}
          backHref={backHref}
          backLabel={backLabel}
          saved={saved}
          onToggleSaved={onToggleSaved}
          onBlockClick={onBlockClick}
          onReportClick={onReportClick}
        />

        <div className="mt-6">
          <ProfileMainPanel
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            showBookingFooter={showBookingFooter}
            provider={provider}
            services={services}
            categorySlug={categorySlug}
          >
            <ProviderTabPanels
              activeTab={activeTab}
              provider={provider}
              categorySlug={categorySlug}
              services={services}
              packages={packages}
              gallery={gallery}
              aboutParagraphs={aboutParagraphs}
              setServicesOpen={setServicesOpen}
            />
          </ProfileMainPanel>
        </div>
      </div>

      <ProviderDetailModals
        servicesOpen={servicesOpen}
        setServicesOpen={setServicesOpen}
        services={services}
        blockOpen={blockOpen}
        setBlockOpen={setBlockOpen}
        reportOpen={reportOpen}
        setReportOpen={setReportOpen}
        doctorName={doctorDisplayName}
        onConfirmBlock={onConfirmBlock}
        onSubmitReport={onSubmitReport}
      />
    </div>
  );
}
