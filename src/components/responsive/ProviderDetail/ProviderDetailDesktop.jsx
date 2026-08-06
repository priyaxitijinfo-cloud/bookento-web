"use client";

import Link from "next/link";

import { DesktopLayout } from "@/components/responsive/layout";
import {
  DoctorProfileSidebarFixed,
  ProfileMainPanel,
  ProviderDetailModals,
  ProviderTabPanels,
} from "./provider-detail-layout";

function DesktopProviderHeader({ backHref, backLabel, profileLabel }) {
  return (
    <div className="mx-auto flex h-[68px] w-full max-w-[90rem] items-center px-6 lg:px-8">
      <div className="min-w-0">
        <Link
          href={backHref}
          className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          {backLabel}
        </Link>
        <h1 className="truncate text-xl font-semibold text-foreground">{profileLabel}</h1>
      </div>
    </div>
  );
}

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
      <DesktopLayout
        header={(
          <DesktopProviderHeader
            backHref={backHref}
            backLabel={backLabel}
            profileLabel={profileLabel}
          />
        )}
        maxWidth="wide"
        contentClassName="!py-4"
      >
        <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
          <div className="hidden xl:block">
            <DoctorProfileSidebarFixed
              provider={provider}
              categorySlug={categorySlug}
              saved={saved}
              onToggleSaved={onToggleSaved}
              onBlockClick={onBlockClick}
              onReportClick={onReportClick}
            />
          </div>

          <ProfileMainPanel
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={onTabChange}
            showBookingFooter={showBookingFooter}
            provider={provider}
            services={services}
            categorySlug={categorySlug}
            mobileFooterClassName="hidden"
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
      </DesktopLayout>

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
