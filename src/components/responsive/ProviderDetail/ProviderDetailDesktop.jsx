"use client";

import {
  DoctorProfileSidebar,
  HomeHeader,
  ProfileDesktopBreadcrumb,
  ProfileMainPanel,
  ProviderDetailModals,
  ProviderTabPanels,
} from "./provider-detail-layout";
import { DESKTOP_STICKY_HEADER_CLASS } from "@/lib/layout/page-layout.constants";

export function ProviderDetailDesktop({
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
    <>
      <div className="bg-surface-page flex h-dvh flex-col overflow-hidden">
        <div className={`${DESKTOP_STICKY_HEADER_CLASS} shrink-0`}>
          <HomeHeader embedded />
          <ProfileDesktopBreadcrumb
            href={backHref}
            backLabel={backLabel}
            currentLabel={profileLabel}
          />
        </div>

        <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col px-4 pt-0 pb-4 md:px-6 md:pt-1 md:pb-4">
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="hidden min-h-0 overflow-y-auto lg:block">
              <DoctorProfileSidebar
                provider={provider}
                categorySlug={categorySlug}
                saved={saved}
                onToggleSaved={onToggleSaved}
                onBlockClick={onBlockClick}
                onReportClick={onReportClick}
              />
            </aside>

            <ProfileMainPanel
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={onTabChange}
              showBookingFooter={showBookingFooter}
              provider={provider}
              services={services}
              categorySlug={categorySlug}
              mobileFooterClassName="hidden"
              fillViewport
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
    </>
  );
}
