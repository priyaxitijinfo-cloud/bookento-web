"use client";

import {
  DoctorProfileMobileHeroHeader,
  ProfileMainPanel,
  ProviderDetailModals,
  ProviderTabPanels,
} from "./provider-detail-layout";

export function ProviderDetailMobile({
  provider,
  categorySlug,
  backHref,
  backLabel,
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
    <div className="bg-surface-page flex h-dvh flex-col overflow-hidden md:min-h-dvh md:overflow-visible md:pb-24">
      <DoctorProfileMobileHeroHeader
        provider={provider}
        categorySlug={categorySlug}
        backHref={backHref}
        backLabel={backLabel}
        saved={saved}
        onToggleSaved={onToggleSaved}
        onBlockClick={onBlockClick}
        onReportClick={onReportClick}
      />

      <div className="bg-background relative -mt-5 flex min-h-0 flex-1 flex-col overflow-hidden rounded-t-[1.75rem] shadow-[0_-6px_24px_rgba(15,23,42,0.08)] md:flex-none md:overflow-visible">
        <ProfileMainPanel
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
          showBookingFooter={showBookingFooter}
          provider={provider}
          services={services}
          categorySlug={categorySlug}
          mobileSheet
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
            mobileSheet
          />
        </ProfileMainPanel>
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
