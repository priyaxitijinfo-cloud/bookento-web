"use client";

import {
  DoctorProfileMobileHeader,
  ProfileMainPanel,
  ProviderDetailModals,
  ProviderTabPanels,
  UserBottomNav,
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
    <div className="bg-surface-page min-h-dvh pb-28">
      <div className="mx-auto w-full max-w-lg px-4 py-4">
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

        <div className="mt-4">
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
      <UserBottomNav />
    </div>
  );
}
